import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";
import {Item} from "./item";

@entity.name('user_inventory')
export class InventoryItem {
    id: UUID & PrimaryKey = uuid();

    user!: User & Reference;
    item!: Item & Reference;

    condition: number = 0; // 0 = Kaputt / Sehr schlecht 1 = Fabrikneu

    created: Date = new Date();
}