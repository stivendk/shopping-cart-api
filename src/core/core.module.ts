import { Module } from "@nestjs/common";
import { CartItemDomainService } from "./application/services/cart-item.domain.service";
import { CartDomainService } from "./application/services/cart.domain.service";
import { ItemDomainService } from "./application/services/item.domain.service";
import { TYPES } from "./application/shared/types";
import { CartRepository } from "src/infrastructure/adapters/cart.repository.adapter";
import { CartItemRepository } from "src/infrastructure/adapters/cart-item.repository.adapter";
import { ItemRepository } from "src/infrastructure/adapters/item.repository.adapter";

const cartService = {
    provide: TYPES.services.CartService,
    useClass: CartDomainService,
}

const cartItemService = {
    provide: TYPES.services.CartItemService,
    useClass: CartItemDomainService,
}

const itemService = {
    provide: TYPES.services.ItemService,
    useClass: ItemDomainService,
}

const cartRepository = {
    provide: TYPES.adapters.CartRepository,
    useClass: CartRepository,
}

const cartItemRepository = {
    provide: TYPES.adapters.CartItemRepository,
    useClass: CartItemRepository,
}

const itemRepository = {
    provide: TYPES.adapters.ItemRepository,
    useClass: ItemRepository,
}

@Module({
    providers: [
        cartService,
        cartItemService,
        itemService,
        cartRepository,
        cartItemRepository,
        itemRepository
    ],
    exports: [
        cartService,
        cartItemService,
        itemService,
        cartRepository,
        cartItemRepository,
        itemRepository,
    ],
})
export class CoreModule { }