import axios, {AxiosError} from "axios";
import {GENERAL} from "../config/general";

export enum RequestMethod {
    GET = "get",
    POST = "post"
}

export class APIErrors {
    constructor(
        public path: string,
        public message: string,
        public code: string = ""
    ) {}
}

export class APIError {
    constructor(
        public message: string,
        public errors: APIErrors[] = []
    ) {}
}


export class API {

    static async request<T>(type: RequestMethod, url: string, data?: any, noToken: boolean = false): Promise<T | APIError> {

        let result;

        let dataSend = {};
        if ( !noToken ) dataSend = {
            token: localStorage.getItem('token')
        }

        const dataReal = Object.assign(dataSend, data);

        console.log('[API.REQUEST]', GENERAL.API_URL + url, dataReal);
        try {
            result = await axios({
                method: type,
                url: GENERAL.API_URL + url,
                data: dataReal
            });

            console.log('[API.REQUEST] result:', result.data as T);

            if ( result.data.errors ) {
                return new APIError(result.data.messages, result.data.errors);
            }

            return result.data as T;
        } catch ( error: any ) {
            if ( error.response.data.errors && error.response.data.errors.length != 0 ) {
                return new APIError(error.response.data.message, error.response.data.errors);
            }
            return new APIError('axios error', [{path: '', code: 'fatal-error', message: error}]);
        }
    }

}