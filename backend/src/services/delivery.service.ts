import { DeliveryRepository } from '../repositories/delivery.repository';
import { OrderRepository } from '../repositories/order.repository';

const deliveryRepository = new DeliveryRepository();
const orderRepository = new OrderRepository();

const MAX_LIVRAISONS_PAR_LIVREUR = 5;

export class DeliveryService {
    async getAll() {
        return deliveryRepository.findAll();
    }

    async getById(id: number) {
        const delivery = await deliveryRepository.findById(id);
        if (!delivery) throw new Error('Livraison non trouvee');
        return delivery;
    }

    async getByLivreur(livreurId: number) {
        return deliveryRepository.findByLivreur(livreurId);
    }

    async getAvailable() {
        return deliveryRepository.findAvailable();
    }

    async assignLivreur(deliveryId: number, livreurId: number) {
        // Check livreur's active delivery count
        const activeCount = await deliveryRepository.countActiveLivraisons(livreurId);
        if (activeCount >= MAX_LIVRAISONS_PAR_LIVREUR) {
            throw new Error(
                `Limite atteinte: un livreur ne peut avoir que ${MAX_LIVRAISONS_PAR_LIVREUR} livraisons actives`
            );
        }

        const delivery = await deliveryRepository.assignLivreur(deliveryId, livreurId);
        if (!delivery) {
            throw new Error('Livraison non disponible ou deja assignee');
        }

        // Update sub-order status to 'expediee'
        await orderRepository.updateSubOrderStatus(delivery.sub_order_id, 'expediee');

        return delivery;
    }

    async updateStatus(deliveryId: number, statut: string, livreurId: number) {
        const delivery = await deliveryRepository.findById(deliveryId);
        if (!delivery) throw new Error('Livraison non trouvee');
        if (delivery.livreur_id !== livreurId) {
            throw new Error('Vous ne pouvez modifier que vos propres livraisons');
        }

        const updated = await deliveryRepository.updateStatus(deliveryId, statut);

        // If delivered, update sub-order and check if all sub-orders are delivered
        if (statut === 'livree' && updated) {
            await orderRepository.updateSubOrderStatus(delivery.sub_order_id, 'livree');

            // Check if all sub-orders of the parent order are delivered
            const deliveryFull = await deliveryRepository.findById(deliveryId);
            if (deliveryFull?.order_id) {
                const subOrders = await orderRepository.findSubOrdersByOrder(deliveryFull.order_id);
                const allDelivered = subOrders.every(so => so.statut === 'livree');
                if (allDelivered) {
                    await orderRepository.updateOrderStatus(deliveryFull.order_id, 'livree');
                }
            }
        }

        return updated;
    }
}
