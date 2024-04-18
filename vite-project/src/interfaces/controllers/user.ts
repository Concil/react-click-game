import {User} from "../database/user";
import {InventoryItem} from "../database/inventory";
import {Hack} from "../database/hack";


export interface UserController {
    check(token: string): Promise<boolean>
    getData(id: string): Promise<User | undefined>
    hello(): Promise<string>;
    randomItem(userId: string, itemId: string): Promise<InventoryItem | string>;
    logout(token: string): Promise<boolean>;
    getHacks(token: string, max?: number): Promise<Hack[] | string>;
}