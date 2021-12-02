import { Player } from "../account/player";
import { animationPlayer } from "./animations";

export interface fireworkPlayer extends Player, animationPlayer{

    fireworkCounter : number;
    
};

export function startFirework(player : fireworkPlayer)
{
    var position = player.position;

    var counter = 0;

    var interval = setInterval(() => {

        counter++;

        mp.players.forEach((element : fireworkPlayer) => {
            if(!element.isLoggedIn) return false;
        
            element.call("receiveFireworkParticle", [position.x, position.y, position.z]);
         
        });

        if(counter > 30)
            clearInterval(interval);

    }, 1000);

}