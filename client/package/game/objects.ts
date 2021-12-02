mp.game.entity.createModelHide(106.93, -1760.255, 31.68, 20.0, mp.game.joaat("sc1_22_ladder_03"), true);
mp.game.entity.createModelHide(106.93, -1760.255, 31.68, 20.0, mp.game.joaat("sc1_22_detail"), true);

mp.game.entity.createModelHide(76.56, -1756.79, 43.64, 20.0, mp.game.joaat("sc1_22_ladder_002"), true);
mp.game.entity.createModelHide(45.80, -1793.43, 43.64, 20.0, mp.game.joaat("sc1_22_ladder_01"), true);

//Teqilala
mp.game.object.doorControl(mp.game.joaat("v_ilev_roc_door4"), -561.2866, 293.5044, 87.77851, false, 0.0, 5.0, 0);
mp.game.object.doorControl(mp.game.joaat("v_ilev_roc_door4"), -565.1712, 276.6259, 83.28626, false, 0.0, 5.0, 0);

mp.game.object.doorControl(mp.game.joaat("p_jewel_door_l"), -631.9554, -236.3333, 38.2065, false, 0.0, 5.0, 0);
mp.game.object.doorControl(mp.game.joaat("p_jewel_door_r1"), -630.4265, -238.4375, 38.2065, false, 0.0, 5.0, 0);

//Tattoo
mp.game.object.doorControl(mp.game.joaat("v_ilev_ta_door"), -1155.454, -1424.008, 5.046147, false, 0.0, 5.0, 0);


//Nationalbank
mp.game.entity.createModelHide(255.2283, 223.976, 102.3932, 20.0, mp.game.joaat("v_ilev_bk_vaultdoor"), true);

mp.game.object.doorControl(mp.game.joaat("v_ilev_j2_door"), 258.2093 ,204.119, 106.4328, false, 0.0, 5.0, 0);
mp.game.object.doorControl(mp.game.joaat("v_ilev_j2_door"), 260.6518, 203.2292, 106.4328, false, 0.0, 5.0, 0);

mp.game.object.doorControl(mp.game.joaat("prop_ld_bankdoors_02"), 232.6054 ,214.1584 ,106.4049, false, 0.0, 5.0, 0);
mp.game.object.doorControl(mp.game.joaat("prop_ld_bankdoors_02"), 231.5075 ,216.5148 ,106.4049, false, 0.0, 5.0, 0);


mp.objects.new(mp.game.joaat("prop_portacabin01"), new mp.Vector3(452.3802, -3077.624, 4.945599), { rotation: new mp.Vector3(0, 0, -180.0), dimension: -1});
