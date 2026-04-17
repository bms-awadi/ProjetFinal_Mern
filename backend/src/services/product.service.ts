import { ProductRepository } from '../repositories/product.repository';

const productRepository = new ProductRepository();

export class ProductService {
    async getAll() {
        return productRepository.findAll();
    }

    async getById(id: number) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Produit non trouve');
        return product;
    }

    async getByVendeur(vendeurId: number) {
        return productRepository.findByVendeur(vendeurId);
    }

    async getByCategorie(categorieId: number) {
        return productRepository.findByCategorie(categorieId);
    }

    async create(data: any, vendeurId: number) {
        return productRepository.create({
            ...data,
            vendeur_id: vendeurId,
        });
    }

    async update(id: number, data: any, vendeurId: number) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Produit non trouve');
        if (product.vendeur_id !== vendeurId) {
            throw new Error('Vous ne pouvez modifier que vos propres produits');
        }
        return productRepository.update(id, data);
    }

    async delete(id: number, vendeurId: number, isAdmin: boolean) {
        const product = await productRepository.findById(id);
        if (!product) throw new Error('Produit non trouve');
        if (!isAdmin && product.vendeur_id !== vendeurId) {
            throw new Error('Vous ne pouvez supprimer que vos propres produits');
        }
        const hasActive = await productRepository.hasActiveOrders(id);
        if (hasActive) {
            throw new Error('Ce produit ne peut pas etre supprime car il fait partie de commandes en cours');
        }
        return productRepository.delete(id);
    }

    async getCategories() {
        return productRepository.findAllCategories();
    }

    async createCategory(nom: string) {
        return productRepository.createCategory(nom);
    }
}
