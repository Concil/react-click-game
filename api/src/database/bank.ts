import {entity, MinLength, PrimaryKey, uuid, UUID} from "@deepkit/type";


@entity.name("banks")
export class Bank {
    id: UUID & PrimaryKey = uuid();

    name: string = "unknown";
    countryCode: string = "DE";
    bankCode: string & MinLength<8> = "";

    iban: string;

    money: number = 0; // wird nach einem fehlschlag erhöht, wenn erfolgreich bekommt der jenige das ganze geld. (ZUFALL)

    created: Date = new Date();
    deleteAt: Date = new Date();
}