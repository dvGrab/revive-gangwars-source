import fs = require("fs");

export class logHelper{

    prefix : string;
    file : string;
    consoleLog : boolean;

    constructor(prefix : string, file : string, consoleLogging : boolean = true)
    {
        this.prefix = prefix;
        this.file = file;
        this.consoleLog = consoleLogging;
    }

    log(text : string)
    {
        var date = new Date();
        
        fs.appendFile("./logs/" + this.file, "[" + this.prefix + "] [" + date.toLocaleString() + "] " + text + "\n", () => { });
        
        if(this.consoleLog)
            console.log("[" + this.prefix + "] [" + date.toLocaleString() + "] " + text);
    }

};
