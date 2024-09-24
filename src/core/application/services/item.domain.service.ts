import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Item } from "src/core/domain/entities/item.entity";
import { ItemStatusEnum } from "src/core/domain/enums/item-status.enum";
import { IItemService } from "src/core/domain/ports/inbound/item.service";
import { IItemRepository } from "src/core/domain/ports/outbound/item.repository";
import { UpdateStockItemRequest } from "src/infrastructure/http-server/model/update-stock-item.request";
import { TYPES } from "../shared/types";

@Injectable()
export class ItemDomainService implements IItemService {
    constructor(
        @Inject(TYPES.adapters.ItemRepository)
        private itemRepository: IItemRepository,
    ) { }

    async getItemById(itemId: number): Promise<Item> {
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
            throw new NotFoundException(`Item with ID ${itemId} not found`);
        }
        return item;
    }

    async getAllItems(): Promise<Item[]> {
        return await this.itemRepository.findAll();
    }

    async updateStockItem(itemId: number, updatedStockRequest: UpdateStockItemRequest): Promise<Item> {
        const item = await this.itemRepository.findById(itemId);
        if (!item) {
            throw new NotFoundException(`Item with ID ${itemId} not found`);
        }
        Object.assign(item, updatedStockRequest);

        item.stock = updatedStockRequest.stock;
        item.status = this.isProductAvailable(item);

        const itemUpdated = await this.itemRepository.update(item);

        return itemUpdated;
    }

    private isProductAvailable(item: Item): ItemStatusEnum {
        if (item.stock <= 0) {
            return ItemStatusEnum.UNAVAILABLE
        }
        return ItemStatusEnum.AVAILABLE
    }

}