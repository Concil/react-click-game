import {UserController} from "./controllers/user";
import {InventoryController} from "./controllers/inventory";
import {BlackmarketController} from "./controllers/blackmarket";
import {IPScannerController} from "./controllers/ipscanner";
import {BankController} from "./controllers/bank";
import {ItemController} from "./controllers/item";
import {RemoteController} from "@deepkit/rpc";

// declaration
export interface RPC {
    user: RemoteController<UserController>;
    inventory: RemoteController<InventoryController>;
    market: RemoteController<BlackmarketController>;
    ipscan: RemoteController<IPScannerController>;
    bank: RemoteController<BankController>;
    item: RemoteController<ItemController>;
}


