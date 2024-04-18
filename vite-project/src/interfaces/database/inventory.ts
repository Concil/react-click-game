import {User} from "./user";
import {Item} from "./item";


export interface InventoryItem {
    id: string;
    user: User;
    item: Item;
    condition: number;
}