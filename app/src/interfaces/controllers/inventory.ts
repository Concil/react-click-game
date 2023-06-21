import {InventoryItem} from "../database/inventory";

export interface InventoryController {
    all(userId: string): Promise<InventoryItem[] | undefined>;
    scrap(token: string, itemId: string): Promise<boolean>;
    craft(token: string, items: string[]): Promise<InventoryItem | string>;
}