import { Body, Controller, Get, Inject, NotFoundException, Param, Put } from "@nestjs/common";
import { Item } from "src/core/domain/entities/item.entity";
import { IItemService } from "src/core/domain/ports/inbound/item.service";
import { UpdateStockItemRequest } from "../model/update-stock-item.request";
import { TYPES } from "src/core/application/shared/types";

@Controller('items')
export class ItemController {

    constructor(
        @Inject(TYPES.services.ItemService)
        private itemService: IItemService
    ) { }

    @Get(':id')
    async getItemById(@Param('id') itemId: number): Promise<Item> {
        try {
            return await this.itemService.getItemById(itemId);
        } catch (error) {
            throw new NotFoundException(`Item with ID ${itemId} not found`);
        }
    }

    @Get()
    async getAllItems(): Promise<Item[]> {
        return await this.itemService.getAllItems();
    }

    @Put(':id')
    async updateStockItem(
        @Param('id') itemId: number,
        @Body() updateStockRequest: UpdateStockItemRequest
    ): Promise<Item> {
        try {
            return await this.itemService.updateStockItem(itemId, updateStockRequest);
        } catch (error) {
            throw new NotFoundException(`Item with ID ${itemId} not found`);
        }
    }
}