import {Database} from "@deepkit/orm";
import {InventoryItem} from "../database/inventory";
import {UserSession} from "../database/user";
import {rpc} from "@deepkit/rpc";
import {Craft} from "../database/craft";
import {randomNumber} from "../utils/number";
import {Item} from "../database/item";


@rpc.controller("inventory")
export class InventoryController {
    constructor(protected database: Database) {}

    @rpc.action()
    async all(token: string): Promise<InventoryItem[] | undefined> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return undefined;

        return await this.database.query(InventoryItem)
            .filter({
                user: session.user
            })
            .joinWith("user")
            .joinWith("item")
            //.useJoin("item").join("craft").end()
            .find();
    }

    @rpc.action()
    use(name: string) {
        //Todo
    }

    @rpc.action()
    async scrap(token: string, itemId: string): Promise<boolean> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return false;

        const item = await this.database.query(InventoryItem).filter({
            id: itemId
        }).findOneOrUndefined();
        if ( !item ) return false;
        if ( session.user !== item.user ) return false;

        session.user.scrap += (item.item.price / 2);

        await this.database.remove(item);
        await this.database.persist(session.user);

        return true;
    }

    @rpc.action()
    async craft(token: string, items: string[]): Promise<InventoryItem | string> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) return "invalid session";
        if ( !session.user ) return "invalid session user";
        if ( items.length === 0 ) return "no items to craft";

        const userItems = await this.database.query(InventoryItem)
            .filter({
                user: session.user
            })
            .joinWith("user")
            .joinWith("item")
            .find();

        const inventoryItems: InventoryItem[] = userItems.filter((invItem) => items.includes(invItem.item.id));
        const requiredItems = inventoryItems.map((invItem) => invItem.item);


        const cractItem = await this.database.query(Craft)
            .filter({
                items: requiredItems
            })
            .joinWith("items")
            .joinWith("item")
            .findOneOrUndefined();
        if ( !cractItem ) return "no blueprint found";


        /*const craftItems = await this.database.query(Craft)
            .joinWith("item")
            .joinWith("items")
            .find();
        if ( craftItems.length === 0 ) return "nothing to craft today";
        let craftedItem: Item | undefined = undefined;

        for (const craftItem of craftItems) {
            const craftLength = craftItem.items.length;
            let searchLength = 0;

            for (const item of items) {
                if (craftItem.items.find((cItem) => cItem.id === item)) {
                    searchLength++;
                }
            }

            if (searchLength === craftLength && items.includes(craftItem.item.id)) {
                craftedItem = craftItem.item;
                break;
            }
        }

        if (!craftedItem) {
            return "required items not available for crafting";
        }*/


        const nInventoryItem = new InventoryItem();
        nInventoryItem.user = session.user;
        nInventoryItem.condition = Math.random();
        nInventoryItem.item = cractItem.item;

        await this.database.persist(nInventoryItem);

        return nInventoryItem;
    }
}