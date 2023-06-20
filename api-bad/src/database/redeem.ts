import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {Item} from "./item";


@entity.name('redeems')
export class Redeem {
    id: UUID & PrimaryKey = uuid();

    code!: string;

    remove: boolean = false; /**werden dann abgezogen, nicht gegeben, als GAG.*/

    money?: number;
    exp?: number;
    item?: Item & Reference;
}