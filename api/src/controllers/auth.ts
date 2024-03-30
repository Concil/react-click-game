import {http, HttpBody} from "@deepkit/http";
import {User} from "../database/user";
import {APP_Database} from "../config/database";


@http.controller("/auth")
export class AuthController {

    constructor(protected database: APP_Database) {}


    @http.POST("/confirm")
    async confirm(body: HttpBody<{id: string, email: string}>) {
        const {id, email} = body;

        const user = await this.database.query(User).filter({
            email: email
        }).findOneOrUndefined();
        if ( !user ) return false;

        if ( user.registerCode !== id) return false;


        user.confirmed = true;
        user.registerCode = "";

        await this.database.persist(user);
        console.log('confirmed');

        return true;
    }
}