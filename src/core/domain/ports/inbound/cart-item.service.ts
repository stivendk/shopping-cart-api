import { AddCartItem } from "src/infrastructure/http-server/model/add-cart-item.request";
import { CartItem } from "../../entities/cart-item.entity";
import { UpdateCartItemRequest } from "src/infrastructure/http-server/model/update-cart-item.request";

export interface ICartItemService {
    createCartItem(addCartItem: AddCartItem): Promise<CartItem>;
    getCartItemById(cartItemId: number): Promise<CartItem>;
    getCartItemsByCartId(cartId: number): Promise<CartItem[]>
    updateCartItem(cartItemId: number, updateRequest: UpdateCartItemRequest): Promise<CartItem>
    deleteCartItem(cartItemId: number): Promise<void>;
}