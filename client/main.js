var obfuscator = require("javascript-obfuscator");
var fs = require("fs")

var returnValue = [];

function getFilesInDirectory(dirPath) {

    var files = fs.readdirSync(dirPath);

    files.forEach(element => {

        if (fs.statSync(dirPath + element).isFile() && (element.indexOf(".js") != -1))
            returnValue.push(dirPath + element + "/");
        else if(fs.statSync(dirPath + element).isDirectory())
            getFilesInDirectory(dirPath + element + "/");
    });
    return returnValue;
}

getFilesInDirectory(process.argv[2]).forEach(element => {


    fs.readFile(element, "ascii", (error, data) => {

        fs.writeFile(element, obfuscator.obfuscate(data, {stringArray: true, transformObjectKeys: true, deadCodeInjection: true} ).getObfuscatedCode(), (error) => {
            console.log("File " + element + " has been obfuscated!");
        });
    });

});

