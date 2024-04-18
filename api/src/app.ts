import 'reflect-metadata';
import {App} from '@deepkit/app';
import {FrameworkModule} from '@deepkit/framework';
import {UserController} from "./controllers/user";
import {APP_Database} from "./config/database";
import {CORSHTTPListener} from "./middlewares/CORS";
import {RPCSecurity, TokenChecker} from "./middlewares/token";
import {httpMiddleware} from "@deepkit/http";
import {AuthController} from "./controllers/auth";
import {InventoryController} from "./controllers/inventory";
import {BlackmarketController} from "./controllers/blackmarket";
import {BankController} from "./controllers/bank";
import {IPScannerController} from "./controllers/ipscanner";
import {ItemController} from "./controllers/item";
import {Config} from "./config/general";
import {WebSocketService} from "./middlewares/websocket";
import {RpcKernelSecurity} from "@deepkit/rpc";


const app = new App({
    config: Config,
    listeners: [
        CORSHTTPListener,
        UserController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController,
        WebSocketService
    ],
    providers: [
        APP_Database,
        {provide: RpcKernelSecurity, useClass: RPCSecurity, scope: 'rpc'},
        TokenChecker,
    ],
    controllers: [
        AuthController,
        UserController,
        InventoryController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController,
        WebSocketService
    ],
    middlewares: [
        httpMiddleware.for(TokenChecker),
    ],
    imports: [new FrameworkModule({
        migrateOnStartup: true,
        debug: true
    })]
});
app.run();
