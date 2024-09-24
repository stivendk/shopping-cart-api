import { UpdateCartRequest } from "src/infrastructure/http-server/model/update-cart.request";
import { Cart } from "../../entities/cart.entity";

export interface ICartService {
    createCart(): Promise<Cart>;
    getCartById(cartId: number): Promise<Cart>;
    updateCart(cartId: number, updateData: UpdateCartRequest): Promise<Cart>;
    getActiveCart(): Promise<Cart | null>;
}