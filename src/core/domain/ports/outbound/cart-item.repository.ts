import { CartItem } from "../../entities/cart-item.entity";

export interface ICartItemRepository {
    save(cartItem: CartItem): Promise<CartItem>;
    findById(cartItemId: number): Promise<CartItem | null>;
    findByItemIdAndCartId(cartId: number, itemId: number): Promise<CartItem | null>;
    findByCartId(cartId: number): Promise<CartItem[]>
    update(cartItem: CartItem): Promise<CartItem>;
    delete(cartItemId: number): Promise<void>;
  }