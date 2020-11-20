import * as mysql from 'mysql';

export class DatabaseConnection {

    private static instance: DatabaseConnection;
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    private connection: mysql.Connection;

    constructor() {
    }

    private createConnection(): void {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "thesis",
            password: "you shall pass"
        });
    }

    public runSql(sqlQuery: string, params?: any[]): Promise<any> {
        let resolve, reject;
        const resultPromise = new Promise<any[]>((innerResolve, innerReject) => {
            resolve = innerResolve;
            reject = innerReject;
        });

        this.createConnection();
        this.connection.connect(err => {
            if (err) {
                reject(err);
            }

            this.connection.query(sqlQuery, params, (err, result) => {
                if (err) {
                    reject(err);
                }
                // this.connection.end();
                resolve(result);
            });
        });

        return resultPromise;
    }



    public testMethod(): void {
        console.log('test method called!!!!!!');
    }
    
}
