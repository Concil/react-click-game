import {BackReference, entity, Maximum, PrimaryKey, uuid, UUID} from "@deepkit/type";
import {Rarity} from "../enums/rarity";
import {Craft} from "./craft";

export enum ItemTypes {
    BOOST,
    BOX,
    CPU,
    RAM,
    GPU,
    STORAGE
}

@entity.name('items')
export class Item {
    id: UUID & PrimaryKey = uuid();

    type: ItemTypes = ItemTypes.CPU;

    name!: string;
    title: string = "";
    description: string = "";
    rarity: Rarity = Rarity.COMMON; //Die Seltenheitsstufe des Items

    price: number = 1;
    offer: number & Maximum<100> = 0; //max 100 (%)

    attack: number = 0; //Der Damage bei angriffen
    defense: number = 0; //Verteidigungen bei Angriffen
    health: number = 0; //Lebenspunkte abzug bei nutzung
    exp: number = 0; /*exp boost?*/
    cooldown: number = 0; //Die Abklingzeit
    speed: number = 0; //Die Geschwindigkeit des Items, z. B. die Anzahl der Klicks pro Sekunde
    requiredLevel: number = 0;

    criticalChance: number = 0; //Die Wahrscheinlichkeit für einen kritischen Treffer bei Angriffen
    criticalMultiplier: number = 0; //Der Multiplikator für den Schaden bei einem kritischen Treffer

    stackable: boolean = false;
    stackSize: number = 0;

    created: Date = new Date();

    craft?: Craft[] & BackReference;
}