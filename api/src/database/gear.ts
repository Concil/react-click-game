import {entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {randomIP} from "../utils/number";
import {InventoryItem} from "./inventory";


@entity.name("user_gears")
export class Gear {
    id: UUID & PrimaryKey = uuid();
    name: string = "unknown"; // user can name the server
    ip: string = randomIP(); // user needs an ip Address

    board?: InventoryItem & Reference;
    cpu?: InventoryItem & Reference;
    gpu?: InventoryItem & Reference;
    ram1?: InventoryItem & Reference;
    ram2?: InventoryItem & Reference;
    ram3?: InventoryItem & Reference;
    ram4?: InventoryItem & Reference;
    hdd1?: InventoryItem & Reference;
    hdd2?: InventoryItem & Reference;
    hdd3?: InventoryItem & Reference;
    ssd1?: InventoryItem & Reference;
    ssd2?: InventoryItem & Reference;
    ssd3?: InventoryItem & Reference;
    ssd4?: InventoryItem & Reference;

    created: Date = new Date();
    modified?: Date;

}