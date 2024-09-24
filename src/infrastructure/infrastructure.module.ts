import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItemRepository } from './adapters/cart-item.repository.adapter';
import { CartItem } from "src/core/domain/entities/cart-item.entity";
import { Cart } from "src/core/domain/entities/cart.entity";
import { Item } from "src/core/domain/entities/item.entity";
import { CartItemController } from "./http-server/controllers/cart-item.controller";
import { CartController } from "./http-server/controllers/cart.controller";
import { ItemController } from "./http-server/controllers/item.controller";
import { CartRepository } from "./adapters/cart.repository.adapter";
import { ItemRepository } from "./adapters/item.repository.adapter";
import { TYPES } from "src/core/application/shared/types";
import { CartDomainService } from "src/core/application/services/cart.domain.service";
import { CartItemDomainService } from "src/core/application/services/cart-item.domain.service";
import { ItemDomainService } from "src/core/application/services/item.domain.service";
import { DatabaseSeederService } from "./shared/database.config.service";
import { APP_FILTER } from "@nestjs/core";
import { GlobalHttpExceptionFilter } from "./shared/global-http-exception.filter";

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

const exceptionHandler = {
  provide: APP_FILTER,
  useClass: GlobalHttpExceptionFilter,
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [CartItem, Cart, Item],
      synchronize: true, // Sincroniza las entidades con la base de datos
      logging: true,
    }),
    TypeOrmModule.forFeature([CartItem, Cart, Item]),
  ],
  providers: [
    cartService,
    cartItemService,
    itemService,
    cartRepository,
    cartItemRepository,
    itemRepository,
    exceptionHandler,
    DatabaseSeederService
  ],
  controllers: [
    CartItemController,
    CartController,
    ItemController,
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
export class InfrastructureModule {
  constructor(private seederService: DatabaseSeederService) {}

  async onModuleInit() {
    await this.seederService.seed();
  }
}