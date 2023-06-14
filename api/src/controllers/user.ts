import {http} from "@deepkit/http";
import {Database} from "@deepkit/orm";


@http.controller("/user")
export class UserController {

    constructor(
        protected database: Database
    ) {}

    @http.GET('/all')
    all() {
        console.log('get all user');
    }
}