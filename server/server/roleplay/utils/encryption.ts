import * as sha256 from "fast-sha256";

export function sha256HexString(text : string)
{
    var buffer = Buffer.from(text);
    var string = Buffer.from(sha256.hash(buffer)).toString("hex");
    return string;
}