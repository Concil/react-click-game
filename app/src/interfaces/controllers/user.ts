import {User} from "../user";
import {InventoryItem} from "../inventory";
import {Hack} from "../hack";


export interface UserController {
    check(token: string): Promise<boolean>
    getData(id: string): Promise<User | undefined>
    hello(): Promise<string>;
    randomItem(userId: string, itemId: string): Promise<InventoryItem | string>;
    logout(token: string): Promise<boolean>;
    getHacks(token: string, max?: number): Promise<Hack[] | string>;
}