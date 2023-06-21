import {Item, ItemTypes} from "../database/item";
import {InventoryItem} from "../database/inventory";


export interface ItemController {
    getItemsOfType(type: ItemTypes): Promise<Item[]>;
    buy(token: string, itemId: string): Promise<InventoryItem | string>;
}