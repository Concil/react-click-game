import {HttpMiddleware, HttpNotFoundError, HttpRequest, HttpResponse} from "@deepkit/http";
import {Database} from "@deepkit/orm";
import {UserToken} from "../database/user";

export class TokenChecker implements HttpMiddleware {
    allowedURLs: string[] = [
        "/user/login",
        "/user/register"
    ]

    constructor(protected database: Database) {}


    async execute(request: HttpRequest, response: HttpResponse, next: (err?: any) => void) {
        if ( !this.allowedURLs.includes(request.getUrl()) ) {
            if ( request.body ) {
                // @ts-ignore
                const bodyToken = request.body.token;

                const token = await this.database.query(UserToken).filter({
                    id: bodyToken
                }).findOneOrUndefined();
                if ( !token ) throw new HttpNotFoundError("token invalid");
            }
        }

        next();
    }
}