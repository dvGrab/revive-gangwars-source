import "reflect-metadata";
import { createConnection } from "typeorm";
import { Users } from "./entities/user";
import { Bans } from "./entities/bans";
import { Punishments } from "./entities/punishments";
import { Gangzones } from "./entities/gangzones";
import { Stats } from "./entities/stats";
import { Leveling } from "./entities/leveling";
import { Inventory } from "./entities/inventory";
import { Timebans } from "./entities/timebans";
import { Vehicles } from "./entities/vehicles";
import { Gift } from "./entities/gift";
import { Warnings } from "./entities/warnings";
import { Reports } from "./entities/reports";
import { Characters } from "./entities/characters";
import { Groups } from "./entities/groups";
import { GroupMembers } from "./entities/group_members";
import { GroupHouses } from "./entities/group_houses";
import { Discord } from "./entities/discord";
import { WeaponTints } from "./entities/weapon_tints";
import { WeaponComponents } from "./entities/weapon_components";
import { Tattooes } from "./entities/tattooes";
import { Killlog } from "./entities/killlog";
import { Clothes } from "./entities/clothes";
import { Egg } from "./entities/egg";
import { WeaponSelected } from "./entities/weapon_selected";
import { VehiclesTuning } from "./entities/vehicles_tuning";
import { BansCheats } from "./entities/bans_cheats";



export const database = createConnection({
    type: "mysql",
    host: "",
    port: 3306,
    username: "",
    password: "", //
    database: "",
    entities: [Users,
        Bans,
        Punishments,
        Gangzones,
        Stats,
        Leveling,
        Inventory,
        Timebans,
        Vehicles,
        Gift,
        Warnings,
        Reports,
        Characters,
        Groups,
        GroupMembers,
        GroupHouses,
        Discord,
        WeaponTints,
        WeaponComponents,
        Tattooes,
        Killlog,
        Clothes,
        Egg,
        WeaponSelected,
        VehiclesTuning,
        BansCheats]
});

