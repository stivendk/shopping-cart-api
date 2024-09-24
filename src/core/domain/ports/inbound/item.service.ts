import { UpdateStockItemRequest } from "src/infrastructure/http-server/model/update-stock-item.request";
import { Item } from "../../entities/item.entity";

export interface IItemService{
    getItemById(itemId: number): Promise<Item>;
    getAllItems(): Promise<Item[]>;
    updateStockItem(itemId: number, updatedStockRequest: UpdateStockItemRequest): Promise<Item>;
}