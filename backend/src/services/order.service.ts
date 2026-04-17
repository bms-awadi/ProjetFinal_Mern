import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { PaymentRepository } from '../repositories/payment.repository';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const deliveryRepository = new DeliveryRepository();
const paymentRepository = new PaymentRepository();

const COMMISSION_RATE = 0.10; // 10% platform commission
const MAX_LIVRAISONS_PAR_LIVREUR = 5;

interface CartItem {
    product_id: number;
    quantite: number;
}

export class OrderService {
    async getAll() {
        return orderRepository.findAll();
    }

    async getById(id: number) {
        return orderRepository.findOrderDetails(id);
    }

    async getByClient(clientId: number) {
        const orders = await orderRepository.findByClient(clientId);
        return Promise.all(orders.map(o => orderRepository.findOrderDetails(o.id!)));
    }

    async getByVendeur(vendeurId: number) {
        const subOrders = await orderRepository.findSubOrdersByVendeur(vendeurId);
        return Promise.all(subOrders.map(async (so) => {
            const items = await orderRepository.findItemsBySubOrder(so.id!);
            const delivery = await deliveryRepository.findBySubOrderId(so.id!);
            return { ...so, items, delivery };
        }));
    }

    /**
     * Create an order with automatic split by vendeur.
     * Uses a transaction with SELECT FOR UPDATE to handle concurrent stock.
     */
    async createOrder(clientId: number, items: CartItem[], adresseLivraison: string) {
        if (!items || items.length === 0) {
            throw new Error('Le panier est vide');
        }

        const txClient = await orderRepository.beginTransaction();

        try {
            // Lock and validate products
            const productDetails: any[] = [];
            for (const item of items) {
                const result = await txClient.query(
                    'SELECT * FROM products WHERE id = $1 FOR UPDATE',
                    [item.product_id]
                );
                const product = result.rows[0];
                if (!product) {
                    throw new Error(`Produit ${item.product_id} non trouve`);
                }
                if (product.stock < item.quantite) {
                    throw new Error(`Stock insuffisant pour ${product.nom} (disponible: ${product.stock}, demande: ${item.quantite})`);
                }
                productDetails.push({ ...product, quantite: item.quantite });
            }

            // Calculate total
            const total = productDetails.reduce((sum, p) => sum + p.prix * p.quantite, 0);
            const commission = total * COMMISSION_RATE;

            // Create main order
            const order = await orderRepository.createOrder({
                client_id: clientId,
                total,
                commission,
                statut: 'en_attente',
            }, txClient);

            // Group items by vendeur for split
            const vendeurGroups = new Map<number, typeof productDetails>();
            for (const product of productDetails) {
                const group = vendeurGroups.get(product.vendeur_id) || [];
                group.push(product);
                vendeurGroups.set(product.vendeur_id, group);
            }

            // Create sub-orders per vendeur
            for (const [vendeurId, products] of vendeurGroups) {
                const sousTotal = products.reduce((sum: number, p: any) => sum + p.prix * p.quantite, 0);

                const subOrder = await orderRepository.createSubOrder({
                    order_id: order.id!,
                    vendeur_id: vendeurId,
                    sous_total: sousTotal,
                    statut: 'en_attente',
                }, txClient);

                // Create order items
                for (const product of products) {
                    await orderRepository.createOrderItem({
                        sub_order_id: subOrder.id!,
                        product_id: product.id,
                        quantite: product.quantite,
                        prix_unitaire: product.prix,
                        sous_total: product.prix * product.quantite,
                    }, txClient);
                }

                // Decrement stock
                for (const product of products) {
                    const updated = await productRepository.updateStock(product.id, product.quantite, txClient);
                    if (!updated) {
                        throw new Error(`Erreur de mise a jour du stock pour ${product.nom}`);
                    }
                }

                // Create delivery entry for this sub-order
                await txClient.query(
                    `INSERT INTO deliveries (sub_order_id, adresse_livraison, statut) VALUES ($1, $2, $3)`,
                    [subOrder.id, adresseLivraison, 'en_attente']
                );
            }

            await orderRepository.commitTransaction(txClient);
            return orderRepository.findOrderDetails(order.id!);

        } catch (error) {
            await orderRepository.rollbackTransaction(txClient);
            throw error;
        }
    }

    async updateStatus(orderId: number, statut: string) {
        return orderRepository.updateOrderStatus(orderId, statut);
    }

    async updateSubOrderStatus(subOrderId: number, statut: string) {
        return orderRepository.updateSubOrderStatus(subOrderId, statut);
    }

    async simulatePayment(orderId: number, methode: string = 'carte') {
        const order = await orderRepository.findById(orderId);
        if (!order) throw new Error('Commande non trouvee');
        if (order.statut !== 'en_attente') throw new Error('Cette commande ne peut plus etre payee');

        // Simulate payment (always succeeds in simulation)
        const payment = await paymentRepository.create({
            order_id: orderId,
            montant: order.total,
            statut: 'accepte',
            methode,
        });

        // Update order and sub-orders status to 'payee'
        await orderRepository.updateOrderStatus(orderId, 'payee');
        const subOrders = await orderRepository.findSubOrdersByOrder(orderId);
        for (const so of subOrders) {
            await orderRepository.updateSubOrderStatus(so.id!, 'payee');
        }

        return payment;
    }

    async deleteOrder(orderId: number) {
        return orderRepository.deleteOrder(orderId);
    }

    async getStats() {
        const total_orders = await orderRepository.countOrders();
        const total_revenue = await orderRepository.totalRevenue();
        const total_commission = await orderRepository.totalCommission();
        return { total_orders, total_revenue, total_commission };
    }
}
