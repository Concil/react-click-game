import {Database} from "@deepkit/orm";
import {rpc} from "@deepkit/rpc";
import {onServerMainBootstrapDone} from "@deepkit/framework";
import {eventDispatcher} from "@deepkit/event";
import {Item} from "../database/item";
import {randomNumber} from "../utils/number";
import {Blackmarket} from "../database/blackmarket";
import {addHours} from "date-fns";
import {InventoryItem} from "../database/inventory";
import {UserSession} from "../database/user";


@rpc.controller("blackmarket")
export class BlackmarketController {
    timer: any = undefined;
    deleteTimer: any = undefined;

    constructor(protected database: Database) {}

    @eventDispatcher.listen(onServerMainBootstrapDone)
    onServerStarted() {
        console.log('serverStarted');

        this.timer = setInterval(this.addSomeItems.bind(this), 5 * 60000);
        this.deleteTimer = setInterval(this.checks.bind(this), 1000);
    }

    async checks() {
        const blackItems = await this.database.query(Blackmarket).joinWith("item").find();
        for ( const item of blackItems) {
            if ( item.deleteAt < new Date()) {
                //remove
                await this.database.remove(item);
                console.log('[BLACKMARKET] removed:', item.item.name)
            }
        }
    }

    async addSomeItems() {
        console.log('[BLACKMARKET] create new item');
        const items = await this.database.query(Item).find();
        if ( items.length === 0 ) return;

        const item = items[randomNumber(0, items.length)];
        if ( !item ) return;

        const nItem = new Blackmarket();
        nItem.item = item;
        nItem.price = item.price;
        nItem.deleteAt = addHours(new Date(), 5);

        let condition = Math.random();
        if ( condition < 0.5 ) condition = 0.5;
        nItem.condition = condition;

        await this.database.persist(nItem);
    }

    @rpc.action()
    async buy(token: string, id: string): Promise<InventoryItem | undefined> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();
        if ( !session ) {
            console.log('[INVENTORY.ALL] cant get session:', token);
            return undefined;
        }

        if ( !id ) return;

        const item = await this.database.query(Blackmarket).filter({
            id: id
        }).joinWith("user").joinWith("item").findOneOrUndefined();
        if ( !item ) return undefined;

        if ( session.user.money < item.price ) return undefined;

        await this.database.remove(item);

        const nInventoryItem = new InventoryItem();
        nInventoryItem.user = session.user;
        nInventoryItem.item = item.item;
        nInventoryItem.condition = item.condition;

        await this.database.persist(nInventoryItem);

        return nInventoryItem;
    }

    @rpc.action()
    async all(): Promise<Blackmarket[] | undefined> {
        return await this.database.query(Blackmarket).joinWith("item").joinWith("user").find();
    }
}