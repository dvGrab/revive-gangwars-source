mp.events.addDataHandler("weatherData", (entity: EntityMp, value: string) => {

    if (value) {
        mp.game.gameplay.setOverrideWeather(value);
        mp.game.gameplay.setWeatherTypeNow(value);
    }


});

setInterval(() => {

    var data = mp.players.local.getVariable("weatherData");

    if (data) {
        mp.game.gameplay.setOverrideWeather(data);
        mp.game.gameplay.setWeatherTypeNow(data);
    }
    
}, 1000 * 60);