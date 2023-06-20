import {BackReference, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {Item} from "./item";


export class Craft {
    id: UUID & PrimaryKey = uuid();

    item!: Item & Reference; // the item to craft
    items!: Item[] & BackReference<{via: typeof Item}>; // the items where needed

    scrap: number = 0;

    created: Date = new Date();
    activeAt?: Date; // if assigned: at this date this craft model can be crafted.
}