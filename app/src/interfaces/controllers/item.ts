import {Item, ItemTypes} from "../item";
import {InventoryItem} from "../inventory";


export interface ItemController {
    getItemsOfType(type: ItemTypes): Promise<Item[]>;
    buy(token: string, itemId: string): Promise<InventoryItem | string>;
}