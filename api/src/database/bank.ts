import {BackReference, entity, MinLength, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {User} from "./user";
import {BankHackers} from "./BankHackers";
import {randomNumber} from "../utils/number";


@entity.name("banks")
export class Bank {
    id: UUID & PrimaryKey = uuid();

    name: string = "unknown";
    countryCode: string = "DE";
    bankCode: string & MinLength<8> = "";
    iban: string;

    money: number = randomNumber(10000, 2000000); // wird nach einem fehlschlag erhöht, wenn erfolgreich bekommt der jenige das ganze geld. (ZUFALL)

    hackers: User[] & BackReference<{via: BankHackers}> = [];

    created: Date = new Date();
    deleteAt: Date = new Date();
}