export enum Rarity {
    COMMON,
    RARE,
    EPIC
}

export enum ItemTypes {
    HARDWARE,
    BOOST,
    BOX
}

export const ItemTypesLabels = [
    "HARDWARE", "BOOST", "BOX"
];

export const RarityLabels = [
    "COMMON", "RARE", "EPIC"
];

export interface Item {
    id: string;

    type: ItemTypes;

    name: string;
    title: string;
    description: string;
    rarity: Rarity; //Die Seltenheitsstufe des Items

    price: number;
    offer: number;

    attack: number; //Der Damage bei angriffen
    defense: number; //Verteidigungen bei Angriffen
    health: number; //Lebenspunkte abzug bei nutzung
    exp: number; /*exp boost?*/
    cooldown: number; //Die Abklingzeit
    speed: number; //Die Geschwindigkeit des Items, z. B. die Anzahl der Klicks pro Sekunde
    requiredLevel: number;

    criticalChance: number; //Die Wahrscheinlichkeit für einen kritischen Treffer bei Angriffen
    criticalMultiplier: number; //Der Multiplikator für den Schaden bei einem kritischen Treffer

    stackable: boolean;
    stackSize: number;

    created: Date;
}