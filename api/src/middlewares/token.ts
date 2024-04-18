import {HttpMiddleware, HttpNotFoundError, HttpRequest, HttpResponse} from "@deepkit/http";
import {Database} from "@deepkit/orm";
import {RpcControllerAccess, RpcKernelSecurity, Session} from "@deepkit/rpc";
import {UserSession} from "../database/user";
import {APP_Database} from "../config/database";

export class TokenChecker implements HttpMiddleware {
    allowedURLs: string[] = [
        "/user/login",
        "/user/register"
    ]

    constructor(protected database: APP_Database) {}


    async execute(request: HttpRequest, response: HttpResponse, next: (err?: any) => void) {
        if ( !this.allowedURLs.includes(request.getUrl()) ) {
            if ( request.body ) {
                // @ts-ignore
                const bodyToken = request.body.token;

                const token = await this.database.query(UserSession).filter({
                    id: bodyToken
                }).findOneOrUndefined();
                if ( !token ) throw new HttpNotFoundError("token invalid");
            }
        }

        next();
    }
}

export class RPCSecurity extends RpcKernelSecurity {

    constructor(protected database: APP_Database) {
        super();
    }

    async hasControllerAccess(session: Session, controllerAccess: RpcControllerAccess): Promise<boolean> {
        console.log('hasControllerAccess', session.token, session.username);
        return true;
    }


    async isAllowedToRegisterAsPeer(session: Session, peerId: string): Promise<boolean> {
        console.log('isAllowedToRegisterAsPeer')
        return true;
    }

    async isAllowedToSendToPeer(session: Session, peerId: string): Promise<boolean> {
        const userSession = await this.database.query(UserSession).filter({
            id: session.token
        }).joinWith("user").findOneOrUndefined();

        if ( !userSession ) return false;
        console.log('isAllowedToSendToPeer:', session.token, userSession.user.username);
        return true;
    }

    async authenticate(token: string): Promise<Session> {
        const session = await this.database.query(UserSession).filter({
            id: token
        }).joinWith("user").findOneOrUndefined();

        if ( !session ) return undefined;

        console.log('authenticated:', token, 'with:', session.user.username);

        return new Session(session.user.username, token);
    }

    transformError(err: Error) {
        console.log('transformError')
        return err;
    }
}
