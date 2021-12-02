var weedObjects = ["bkr_prop_weed_01_small_01a", "bkr_prop_weed_01_small_01b","bkr_prop_weed_01_small_01c"];

mp.events.add(RageEnums.EventKey.RENDER, () => {

    for(var i = 0; i < weedObjects.length; i++)
    {
        mp.objects.forEach((element) => {
            if(element.model == mp.game.joaat(weedObjects[i]))
                element.setCollision(false, true);
        });
    }

});

mp.events.add("client:PlaceWeedPerfectPosition", () =>{
    var position = mp.players.local.position;
    var weedbucket = mp.objects.new(mp.game.joaat("bkr_prop_weed_01_small_01a"), position);
    mp.events.callRemote("server:RequestCreateWeed", weedbucket.position.x, weedbucket.position.y, weedbucket.position.z, weedbucket.getHeightAboveGround());
    weedbucket.destroy();
});

mp.keys.bind(0x45, false, () => {
    if(mp.gui.chat.enabled)
        return false;

    if(isMenuOpened)
        return false;

    mp.events.callRemote("server:GetWater");
    mp.events.callRemote("server:BuyWeedSeeds");
    mp.events.callRemote("server:HarvestWeedPlant");
});
