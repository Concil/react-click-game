import {Blackmarket} from "../blackmarket";
import {InventoryItem} from "../inventory";

export interface BlackmarketController {
    buy(token: string, id: string): Promise<InventoryItem | string>
    all(): Promise<Blackmarket[] | undefined>
}