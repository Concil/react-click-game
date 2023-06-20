import {rpc} from "@deepkit/rpc";
import {Item, ItemTypes} from "../database/item";
import {Database} from "@deepkit/orm";
import {UserSession} from "../database/user";
import {InventoryItem} from "../database/inventory";


@rpc.controller("item")
export class ItemController {

    constructor(protected database: Database) {}

    @rpc.action()
    async getItemsOfType(type: ItemTypes): Promise<Item[]> {
        return await this.database.query(Item).filter({
            type: type
        }).find();
    }

    @rpc.action()
    async buy(token: string, itemId: string): Promise<InventoryItem | string> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return "invalid session";
        if ( !session.user ) return "invalid user";

        const item = await this.database.query(Item).filter({id: itemId}).findOneOrUndefined();
        if ( !item ) return "invalid item";

        if (session.user.money < this.getItemPrice(item.price, 1, item.offer)) return "not enough money";

        const nInvItem = new InventoryItem();
        nInvItem.item = item;
        nInvItem.user = session.user;
        nInvItem.condition = 1;

        await this.database.persist(nInvItem);
        return nInvItem;
    }


    getItemPrice(price: number, condition: number, offer: number = 0): number {
        const priceRegular = (price * condition);

        if ( offer !== 0 ) {
            const offerPrice = priceRegular * offer / 100;
            return priceRegular - offerPrice;
        }

        return priceRegular;
    }
}