import express from "express";
import bodyParser from "body-parser";

export class Server {
    port: number = 8080;

    app = express();

    _controllers: any[] = [];

    constructor() {


        this.middlewares();
        this.controllers();
        this.start();
    }

    public addC<T>(controllerClass: new () => T) {
        const controllerInstance = new controllerClass();
        this._controllers.push(controllerInstance);
    }

    public getC<T>(controllerClass: new () => T): T | undefined {
        return this._controllers.find((controller) => controller instanceof controllerClass);
    }

    private controllers() {
        
    }

    private middlewares() {
        this.app.use(express.json());
        this.app.use(bodyParser());
    }

    private start() {
        this.app.listen(this.port, () => {
            console.log()
        });
    }
}

new Server();