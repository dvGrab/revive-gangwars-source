mp.keys.bind(71, false, () => {

    if (mp.gui.chat.enabled)
        return false

    if (mp.players.local.vehicle)
        return false;

    var playerPosition = mp.players.local.position;
    var vehicleIndex = mp.game.vehicle.getClosestVehicle(playerPosition.x, playerPosition.y, playerPosition.z, 7, 0, 70);
    var vehicleObj = mp.vehicles.atHandle(vehicleIndex);

    if (!mp.vehicles.exists(vehicleObj))
        return false;

    if (mp.raycasting.testPointToPoint(mp.players.local.position, vehicleObj.position)) {
        for (var i = 0; i < vehicleObj.getMaxNumberOfPassengers(); i++) {
            if (!vehicleObj.isSeatFree(i))
                continue;

            mp.players.local.taskEnterVehicle(vehicleIndex, 2000, i, 2.0, 1, 0);
            break;
        }
    }

});

mp.keys.bind(46, false, () => {

    if (mp.gui.chat.enabled)
        return false;

    if (mp.players.local.vehicle)
        return false;

    var playerPosition = mp.players.local.position;
    var vehicleIndex = mp.game.vehicle.getClosestVehicle(playerPosition.x, playerPosition.y, playerPosition.z, 7, 0, 70);
    var vehicleObj = mp.vehicles.atHandle(vehicleIndex);

    if (!mp.vehicles.exists(vehicleObj))
        return false;

    if (mp.raycasting.testPointToPoint(mp.players.local.position, vehicleObj.position)) {
        if (vehicleObj.isSeatFree(-1))
            mp.players.local.taskEnterVehicle(vehicleIndex, 2000, -1, 2.0, 1, 0);
    }
});