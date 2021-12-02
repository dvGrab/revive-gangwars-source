
mp.keys.bind(0x45, true, () => {
    if(!mp.gui.chat.enabled)
    {
        mp.events.callRemote("server:JuwelryReceiver");   
        mp.events.callRemote("server:JuwelryBagpickup");
        mp.events.callRemote("server:JuwelryHacking");
        mp.events.callRemote("server:JuwelryRobbing"); 
        mp.events.callRemote("server:JuwelryWarehouse");
    }
});


mp.events.add("client:getPerfectGroundPosition", (x : number, y :  number, z : number) => {

    var object = mp.objects.new(mp.game.joaat("p_ld_heist_bag_s_pro2_s"), new mp.Vector3(x, y, z));
    mp.events.callRemote("server:JuwelryDropbag", object.position.x, object.position.y, object.position.z, object.getHeightAboveGround());
    object.destroy();

});