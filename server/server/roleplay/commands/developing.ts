import * as fs from "fs";
import { Ranks } from "../admin";
import { Player } from "../account/player";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import { Vehicle } from "../vehicles/shops";

mp.events.addCommand("savepos", (player : Player, info) => {

    var text = "/* " + player.heading + " */ new mp.Vector3(" + player.position.x + ", " + player.position.y + ", " +( player.position.z - 0.5 )+ ") //" + info + "\n";

    fs.appendFile("./log.txt", text, (error) => {
        console.log("error writing position file. (" + error + ")")
    });

    player.notify("~b~Position has been saved.");

    mp.markers.new(1, player.position, 3.0, { color: [255, 0, 0, 180]});
});

mp.events.addCommand("car", (player : Player, carname) => {
    if(player.info.admin == Ranks.Projectlead)
    {
        var cars = mp.vehicles.new(mp.joaat(carname), player.position);
    
        cars.dimension = player.dimension;

        player.putIntoVehicle(cars, -1);

        mp.vehicles.forEach((entity: Vehicle) => {
            if (entity.id == cars.id) {
                entity.user = player;
                entity.timespawned = 0;
            }
        });
    }

});

mp.events.addCommand("skin", (player : Player, skinname) =>{
    if(player.info.admin == Ranks.Projectlead)
        player.model = mp.joaat(skinname);
});

mp.events.addCommand("invoke", (player : Player, fulText : string, Arg1 : string, Arg2) =>{

});


mp.events.addCommand("fx", (player : Player) => {
    player.call("startFirework");
})

mp.events.addCommand("giveweap", (player : Player, fullText : string) => {
   
    if(player.info.admin >= Ranks.Projectlead)
    {
        player.giveWeapon(mp.joaat(fullText), 2000);
    }

});