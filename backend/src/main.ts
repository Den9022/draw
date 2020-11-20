import { Server } from './web/server/server';
//import { AuthInterceptor } from './web/rest/authentication/auth-interceptor';
//import { UserService } from './service/user-service';
//import { SqlScriptReader } from './data/database/sql-scripts';
//import { DatabaseConnection } from './data/database/database-connection';
//import { Tests } from '../test/tests';
//import { RoomDao } from './data/dao/room-dao';
//import { RoomEntity } from './data/entity/room-entity';
//import { UserDao } from './data/dao/user-dao';
//import { RoomService } from './service/room-service';
//import { TokenService } from './service/token-service';
//import { UserVo } from './service/vo/user-vo';
//import { Room } from './web/socket/room/room';
// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// const server: Server = require('../server/server');


// setTimeout(() => AuthInterceptor.checkToken(null, null, null), 2000);
// const userService = DIContainer.getInstanceOf(UserService);
// AuthInterceptor.checkToken(null, null, null);

// var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "thesis",
//     password: "you shall pass"
//   });

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     con.query('select * from thesis.TEST;', function (err, result) {
//       if (err) throw err;
//       console.log("Result:\n");
//       console.log('id: ' + result[0].id + ',  text: ' + result[0].text);
//     });
//   });

// var dbConn = require('./data/database-connection');
// dbConn.query('select * from thesis.TEST;');

// var fs = require('fs');
// fs.readFile('./sql/test.sql', 'utf8', function(err, data) {
//     if (err) throw err;
//     console.log('--- data from file ---\n', data);
// });

// var sqlScripts = require('./data/database/sql-scripts');
// sqlScripts.get(sqlScripts.TEST)
// .then(data => console.log('--- data ---\n', data))
// .catch(error => console.log('--- error ---\n', error));

// const valami = new SqlScriptReader();

//const testRoom = Room.setUpNewRoom("asd", 123);



const server = new Server();
server.startServer();


//console.log('Testing Starts');
