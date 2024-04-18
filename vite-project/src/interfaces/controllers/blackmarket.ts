import {Blackmarket} from "../database/blackmarket";
import {InventoryItem} from "../database/inventory";

export interface BlackmarketController {
    buy(token: string, id: string): Promise<InventoryItem | string>
    all(): Promise<Blackmarket[] | undefined>
}