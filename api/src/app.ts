import 'reflect-metadata';
import {App} from '@deepkit/app';
import {FrameworkModule} from '@deepkit/framework';
import {UserController} from "./controllers/user";
import {database} from "./config/database";
import {Database} from "@deepkit/orm";
import {CORSHTTPListener} from "./middlewares/CORS";
import {RPCSecurity, TokenChecker} from "./middlewares/token";
import {httpMiddleware} from "@deepkit/http";
import {RpcKernel, RpcKernelConnections, RpcKernelSecurity} from "@deepkit/rpc";
import * as WebSocket from "ws";
import {AuthController} from "./controllers/auth";
import {InventoryController} from "./controllers/inventory";
import {BlackmarketController} from "./controllers/blackmarket";
import {BankController} from "./controllers/bank";
import {IPScannerController} from "./controllers/ipscanner";
import {ItemController} from "./controllers/item";

const wss = new WebSocket.Server({noServer: true});

export class Config {
    secret: string = "4b9a7a24613df27b649c3939ab3e4d8d6f0480a4a1e24b5a960f0c71902a1f26";
}

const app = new App({
    config: Config,
    listeners: [
        RPCSecurity,
        CORSHTTPListener,
        UserController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController
    ],
    providers: [
        {provide: Database, useValue: database},
        {provide: RpcKernelSecurity, useClass: RPCSecurity, scope: 'rpc'},
        TokenChecker,
        RPCSecurity
    ],
    controllers: [
        RPCSecurity,
        AuthController,
        UserController,
        InventoryController,
        BlackmarketController,
        BankController,
        IPScannerController,
        ItemController
    ],
    middlewares: [
        httpMiddleware.for(TokenChecker),
    ],
    imports: [new FrameworkModule({
        migrateOnStartup: true,
        debug: true
    })]
});

const kernel = app.get(RpcKernel);
kernel.onConnection((connection) => {
    console.log(connection.clientAddress(), 'connected');
});


app.run();
