import 'reflect-metadata';
import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import {UserController} from "./controllers/user";
import {database} from "./config/database";
import {Database} from "@deepkit/orm";
import {SecretRouteListeners} from "./middlewares/CORS";
import {TokenChecker} from "./middlewares/token";
import {httpMiddleware} from "@deepkit/http";

new App({
    listeners: [
        SecretRouteListeners
    ],
    providers: [
        {provide: Database, useValue: database},
        TokenChecker,
    ],
    controllers: [
        UserController
    ],
    middlewares: [
        httpMiddleware.for(TokenChecker),
    ],
    imports: [new FrameworkModule({
        migrateOnStartup: true,
        debug: true
    })]
}).run();