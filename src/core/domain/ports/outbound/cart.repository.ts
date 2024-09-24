import { Cart } from "../../entities/cart.entity";
import { CartStatusEnum } from "../../enums/cart-status.enum";

export interface ICartRepository {
    save(cart: Cart): Promise<Cart>;
    findById(cartId: number): Promise<Cart | null>;
    update(cart: Cart): Promise<Cart>;
    findByStatusIn(statuses: CartStatusEnum[]): Promise<Cart | null>
    findByStatusNot(status: CartStatusEnum): Promise<Cart[]>
}