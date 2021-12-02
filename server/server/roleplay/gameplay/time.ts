import { Player } from "../account/player";
import { Ranks } from "../admin";


var weatherNames = ["EXTRASUNNY", "CLEAR", "CLEAR", "CLEAR", "CLEAR", "CLOUDS", "EXTRASUNNY", "EXTRASUNNY", "EXTRASUNNY"];

var globalWeather = Math.floor(Math.random() * weatherNames.length);

interface playerWeather extends Player {
    weathername: string;
}

setInterval(() => {

    var time = new Date();
    mp.world.time.set(time.getHours(), time.getMinutes(), time.getSeconds());

}, 1000);

setInterval(() => {

    globalWeather = Math.floor(Math.random() * weatherNames.length);

    mp.world.weather = weatherNames[globalWeather];

    mp.players.forEach((player: playerWeather) => {
        player.setVariable("weatherData", mp.world.weather);
    });

}, 1800 * 1000);

mp.events.add("playerReady", (player: playerWeather) => {
    player.setVariable("weatherData", mp.world.weather);
});

mp.events.addCommand("weather", (player : Player, fullText) => {

    if(player.info.admin >= Ranks.Admin)
    {
        mp.world.weather = fullText;

        mp.players.forEach((player: playerWeather) => {
            player.setVariable("weatherData", mp.world.weather);
        });
    
    }

});