
class SqlScript {
    
    constructor(public readonly relativePath: string) {}

}

export class SqlScriptReader {

    private static readonly BASE_DIR = './sql/';
    public static readonly TEST = new SqlScript(`${SqlScriptReader.BASE_DIR}test.sql`);

    private fileSystem = require('fs');

    public get(sqlScript: SqlScript): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.fileSystem.readFile(sqlScript.relativePath,'utf8', (error: any, data: any) => error ? reject(error) : resolve(data));
        });
    }

}
