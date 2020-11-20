import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import { ServerSocket } from "../socket/server-socket";
import { Routes } from "./routes";

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
  ];
 
export class Server {

    private port: number;
    private host: string;
    private app: express.Application;
    private httpServer: http.Server;
    private routes: Routes;
    private socket: ServerSocket;
 
    constructor(){
        this.port =  4000;
        this.host = `localhost`;
        
        this.app = express();
        this.httpServer = new http.Server(this.app);
        this.socket = new ServerSocket(this.httpServer);
    }
 
    public startServer() {
        this.app.use(
            bodyParser.json()
        );
        this.app.use(
            cors()
        );

       this.routes = new Routes(this.app);
        this.app.get('*', (request, response) => {
            if (allowedExt.filter(ext => request.url.indexOf(ext) > 0).length > 0) {
                response.sendFile(path.resolve(`src/web/resources/angular/${request.url}`));
              } else {
                response.sendFile(path.resolve('src/web/resources/angular/index.html'));
            }
        });

        this.httpServer.listen(this.port, this.host, () => {
            console.log(`Listening on http://${this.host}:${this.port}`);
        });

        //Chat.getInstance().setUpChatForRoom('room-main');

        // const teams = [[1,2], [3,4]];
        // const game = new GameEngine(teams);
        // game.initDeck();
    }
 
}
