import { Player } from "../account/player";
import { Server } from "http";
import { throws } from "assert";
import { Distance } from "../warflags/flags";
import { overlayError, overlaySuccess } from "../utils/utils";
import { playerClothes } from "../spawning/clothes";
import { database } from "../database/manager";
import { Tattooes } from "../database/entities/tattooes";

var jsonTattoos = {
    "PedDecorationCollection": {
        "bRequiredForSync": {
            "_value": "true"
        },
        "presets": {
            "Item": [
                {
                    "uvPos": {
                        "_x": "0.845000",
                        "_y": "0.680000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_M_000_A",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_A",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.745000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "-4.320000"
                    },
                    "nameHash": "FM_CREW_M_000_B",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_B",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "1.245000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "-4.320000"
                    },
                    "nameHash": "FM_CREW_M_000_C",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_C",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.820000",
                        "_y": "0.650000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_M_000_D",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_D",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.740000",
                        "_y": "0.575000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.110000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_M_000_E",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_E",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.675000"
                    },
                    "scale": {
                        "_x": "0.110000",
                        "_y": "0.110000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_M_000_F",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Male_Crew_F",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.810000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.040000",
                        "_y": "0.040000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_F_000_A",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Female_Crew_A",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.810000",
                        "_y": "0.650000"
                    },
                    "scale": {
                        "_x": "0.040000",
                        "_y": "0.040000"
                    },
                    "rotation": {
                        "_value": "-9.360000"
                    },
                    "nameHash": "FM_CREW_F_000_B",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Female_Crew_B",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.740000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_F_000_C",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Female_Crew_C",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.740000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_CREW_F_000_D",
                    "txdHash": "CREW_EMBLEM_TEXTURE",
                    "txtHash": "CREW_EMBLEM_TEXTURE",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Female_Crew_D",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.500000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.450000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_000",
                    "txdHash": "mp_fm_tat_award_000",
                    "txtHash": "mp_fm_tat_award_000",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Head Banger",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.125000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_001",
                    "txdHash": "mp_fm_tat_award_001",
                    "txtHash": "mp_fm_tat_award_001",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "The Slayer",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.530000",
                        "_y": "0.770000"
                    },
                    "scale": {
                        "_x": "0.115000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_002",
                    "txdHash": "mp_fm_tat_award_002",
                    "txtHash": "mp_fm_tat_award_002",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Clear Out",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.370000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_003",
                    "txdHash": "mp_fm_tat_award_003",
                    "txtHash": "mp_fm_tat_award_003",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "The Hustler",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.265000",
                        "_y": "0.275000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_004",
                    "txdHash": "mp_fm_tat_award_004",
                    "txtHash": "mp_fm_tat_award_004",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Armored Van Takedown",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.220000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_005",
                    "txdHash": "mp_fm_tat_award_005",
                    "txtHash": "mp_fm_tat_award_005",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Win Every Game Mode Once",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.330000",
                        "_y": "0.300000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_006",
                    "txdHash": "mp_fm_tat_award_006",
                    "txtHash": "mp_fm_tat_award_006",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Bounty Killer",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.500000",
                        "_y": "0.800000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_007",
                    "txdHash": "mp_fm_tat_award_007",
                    "txtHash": "mp_fm_tat_award_007",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "World Record Race",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_008",
                    "txdHash": "mp_fm_tat_award_008",
                    "txtHash": "mp_fm_tat_award_008",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Fully Modded",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.750000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_009",
                    "txdHash": "mp_fm_tat_award_009",
                    "txtHash": "mp_fm_tat_award_009",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Revenge Kill",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.300000",
                        "_y": "0.450000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "90.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_010",
                    "txdHash": "mp_fm_tat_award_010",
                    "txtHash": "mp_fm_tat_award_010",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Kill 3 Racers",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "-6.840000"
                    },
                    "nameHash": "FM_Tat_Award_M_011",
                    "txdHash": "mp_fm_tat_award_011",
                    "txtHash": "mp_fm_tat_award_011",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Reach Rank",
                    "awardLevel": "1"
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "-6.840000"
                    },
                    "nameHash": "FM_Tat_Award_M_012",
                    "txdHash": "mp_fm_tat_award_012",
                    "txtHash": "mp_fm_tat_award_012",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Reach Rank",
                    "awardLevel": "2"
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "-6.840000"
                    },
                    "nameHash": "FM_Tat_Award_M_013",
                    "txdHash": "mp_fm_tat_award_013",
                    "txtHash": "mp_fm_tat_award_013",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Reach Rank",
                    "awardLevel": "3"
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.230000"
                    },
                    "scale": {
                        "_x": "0.220000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_014",
                    "txdHash": "mp_fm_tat_award_014",
                    "txtHash": "mp_fm_tat_award_014",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Putting The Sneak to Sleep",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.500000",
                        "_y": "0.810000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.220000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_015",
                    "txdHash": "mp_fm_tat_award_015",
                    "txtHash": "mp_fm_tat_award_015",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "The Champion",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.215000",
                        "_y": "0.325000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_016",
                    "txdHash": "mp_fm_tat_award_016",
                    "txtHash": "mp_fm_tat_award_016",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Armed Robber",
                    "awardLevel": "1"
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.215000",
                        "_y": "0.325000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_017",
                    "txdHash": "mp_fm_tat_award_017",
                    "txtHash": "mp_fm_tat_award_017",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Armed Robber",
                    "awardLevel": "2"
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.215000",
                        "_y": "0.325000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_018",
                    "txdHash": "mp_fm_tat_award_018",
                    "txtHash": "mp_fm_tat_award_018",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Armed Robber",
                    "awardLevel": "3"
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.215000",
                        "_y": "0.325000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_M_019",
                    "txdHash": "mp_fm_tat_award_019",
                    "txtHash": "mp_fm_tat_award_019",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Armed Robber",
                    "awardLevel": "4"
                },
                {
                    "uvPos": {
                        "_x": "-0.345000",
                        "_y": "0.638000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.330000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_000",
                    "txdHash": "mp_fm_tat_000",
                    "txtHash": "mp_fm_tat_000",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.510000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.360000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_001",
                    "txdHash": "mp_fm_tat_001",
                    "txtHash": "mp_fm_tat_001",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.150000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.350000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_002",
                    "txdHash": "mp_fm_tat_002",
                    "txtHash": "mp_fm_tat_002",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.755000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_003",
                    "txdHash": "mp_fm_tat_003",
                    "txtHash": "mp_fm_tat_003",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.720000",
                        "_y": "0.325000"
                    },
                    "scale": {
                        "_x": "0.270000",
                        "_y": "0.240000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_004",
                    "txdHash": "mp_fm_tat_004",
                    "txtHash": "mp_fm_tat_004",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.240000",
                        "_y": "0.560000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.350000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_005",
                    "txdHash": "mp_fm_tat_005",
                    "txtHash": "mp_fm_tat_005",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.540000"
                    },
                    "scale": {
                        "_x": "0.147000",
                        "_y": "0.370000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_006",
                    "txdHash": "mp_fm_tat_006",
                    "txtHash": "mp_fm_tat_006",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.140000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.260000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_007",
                    "txdHash": "mp_fm_tat_007",
                    "txtHash": "mp_fm_tat_007",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.250000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "-0.192000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_008",
                    "txdHash": "mp_fm_tat_008",
                    "txtHash": "mp_fm_tat_008",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.350000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_009",
                    "txdHash": "mp_fm_tat_009",
                    "txtHash": "mp_fm_tat_009",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.830000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_010",
                    "txdHash": "mp_fm_tat_010",
                    "txtHash": "mp_fm_tat_010",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.140000",
                        "_y": "0.650000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "9.720000"
                    },
                    "nameHash": "FM_Tat_M_011",
                    "txdHash": "mp_fm_tat_011",
                    "txtHash": "mp_fm_tat_011",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.750000",
                        "_y": "0.285000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.340000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_012",
                    "txdHash": "mp_fm_tat_012",
                    "txtHash": "mp_fm_tat_012",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.280000",
                        "_y": "0.640000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_013",
                    "txdHash": "mp_fm_tat_013",
                    "txtHash": "mp_fm_tat_013",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.700000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.147000",
                        "_y": "0.310000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_014",
                    "txdHash": "mp_fm_tat_014",
                    "txtHash": "mp_fm_tat_014",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.480000",
                        "_y": "0.880000"
                    },
                    "scale": {
                        "_x": "0.060000",
                        "_y": "0.080000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_015",
                    "txdHash": "mp_fm_tat_015",
                    "txtHash": "mp_fm_tat_015",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.470000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.360000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_016",
                    "txdHash": "mp_fm_tat_016",
                    "txtHash": "mp_fm_tat_016",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.380000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.233000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_017",
                    "txdHash": "mp_fm_tat_017",
                    "txtHash": "mp_fm_tat_017",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.280000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.330000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_018",
                    "txdHash": "mp_fm_tat_018",
                    "txtHash": "mp_fm_tat_018",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.220000",
                        "_y": "0.470000"
                    },
                    "scale": {
                        "_x": "0.270000",
                        "_y": "0.360000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_019",
                    "txdHash": "mp_fm_tat_019",
                    "txtHash": "mp_fm_tat_019",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.350000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_020",
                    "txdHash": "mp_fm_tat_020",
                    "txtHash": "mp_fm_tat_020",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_021",
                    "txdHash": "mp_fm_tat_021",
                    "txtHash": "mp_fm_tat_021",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.800000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_022",
                    "txdHash": "mp_fm_tat_022",
                    "txtHash": "mp_fm_tat_022",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_023",
                    "txdHash": "mp_fm_tat_023",
                    "txtHash": "mp_fm_tat_023",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.725000",
                        "_y": "0.460000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.290000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_024",
                    "txdHash": "mp_fm_tat_024",
                    "txtHash": "mp_fm_tat_024",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.640000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_025",
                    "txdHash": "mp_fm_tat_025",
                    "txtHash": "mp_fm_tat_025",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.300000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_026",
                    "txdHash": "mp_fm_tat_026",
                    "txtHash": "mp_fm_tat_026",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.520000",
                        "_y": "0.760000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_027",
                    "txdHash": "mp_fm_tat_027",
                    "txtHash": "mp_fm_tat_027",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.440000",
                        "_y": "0.440000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.220000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_028",
                    "txdHash": "mp_fm_tat_028",
                    "txtHash": "mp_fm_tat_028",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.900000",
                        "_y": "0.240000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_029",
                    "txdHash": "mp_fm_tat_029",
                    "txtHash": "mp_fm_tat_029",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.660000"
                    },
                    "scale": {
                        "_x": "0.110000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_030",
                    "txdHash": "mp_fm_tat_030",
                    "txtHash": "mp_fm_tat_030",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.528000",
                        "_y": "0.770000"
                    },
                    "scale": {
                        "_x": "0.256000",
                        "_y": "0.256000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_031",
                    "txdHash": "mp_fm_tat_031",
                    "txtHash": "mp_fm_tat_031",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.260000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_032",
                    "txdHash": "mp_fm_tat_032",
                    "txtHash": "mp_fm_tat_032",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.260000",
                        "_y": "0.640000"
                    },
                    "scale": {
                        "_x": "0.400000",
                        "_y": "0.340000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_033",
                    "txdHash": "mp_fm_tat_033",
                    "txtHash": "mp_fm_tat_033",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.840000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_034",
                    "txdHash": "mp_fm_tat_034",
                    "txtHash": "mp_fm_tat_034",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "1.100000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.260000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_035",
                    "txdHash": "mp_fm_tat_035",
                    "txtHash": "mp_fm_tat_035",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.725000",
                        "_y": "0.315000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_036",
                    "txdHash": "mp_fm_tat_036",
                    "txtHash": "mp_fm_tat_036",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.250000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.230000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_037",
                    "txdHash": "mp_fm_tat_037",
                    "txtHash": "mp_fm_tat_037",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.550000",
                        "_y": "0.450000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "-180.000000"
                    },
                    "nameHash": "FM_Tat_M_038",
                    "txdHash": "mp_fm_tat_038",
                    "txtHash": "mp_fm_tat_038",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_039",
                    "txdHash": "mp_fm_tat_039",
                    "txtHash": "mp_fm_tat_039",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.300000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.400000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_040",
                    "txdHash": "mp_fm_tat_040",
                    "txtHash": "mp_fm_tat_040",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.480000",
                        "_y": "0.850000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_041",
                    "txdHash": "mp_fm_tat_041",
                    "txtHash": "mp_fm_tat_041",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.300000",
                        "_y": "0.400000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_042",
                    "txdHash": "mp_fm_tat_042",
                    "txtHash": "mp_fm_tat_042",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_043",
                    "txdHash": "mp_fm_tat_043",
                    "txtHash": "mp_fm_tat_043",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.275000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_044",
                    "txdHash": "mp_fm_tat_044",
                    "txtHash": "mp_fm_tat_044",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.370000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_045",
                    "txdHash": "mp_fm_tat_045",
                    "txtHash": "mp_fm_tat_045",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.485000"
                    },
                    "scale": {
                        "_x": "0.340000",
                        "_y": "0.330000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_046",
                    "txdHash": "mp_fm_tat_046",
                    "txtHash": "mp_fm_tat_046",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.880000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.140000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_M_047",
                    "txdHash": "mp_fm_tat_047",
                    "txtHash": "mp_fm_tat_047",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.500000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.450000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_000",
                    "txdHash": "mp_fm_tat_award_000",
                    "txtHash": "mp_fm_tat_award_000",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Head Banger",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.350000",
                        "_y": "0.440000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_001",
                    "txdHash": "mp_fm_tat_award_001",
                    "txtHash": "mp_fm_tat_award_001",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "The Slayer",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.500000",
                        "_y": "0.760000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.190000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_002",
                    "txdHash": "mp_fm_tat_award_002",
                    "txtHash": "mp_fm_tat_award_002",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Clear Out",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.350000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_003",
                    "txdHash": "mp_fm_tat_award_003",
                    "txtHash": "mp_fm_tat_award_003",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "The Hustler",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_004",
                    "txdHash": "mp_fm_tat_award_004",
                    "txtHash": "mp_fm_tat_award_004",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Armored Van Takedown",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.260000",
                        "_y": "0.260000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_005",
                    "txdHash": "mp_fm_tat_award_005",
                    "txtHash": "mp_fm_tat_award_005",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Win Every Game Mode Once",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.365000",
                        "_y": "0.300000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_006",
                    "txdHash": "mp_fm_tat_award_006",
                    "txtHash": "mp_fm_tat_award_006",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Bounty Killer",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.465000",
                        "_y": "0.800000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_007",
                    "txdHash": "mp_fm_tat_award_007",
                    "txtHash": "mp_fm_tat_award_007",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "World Record Race",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.380000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_008",
                    "txdHash": "mp_fm_tat_award_008",
                    "txtHash": "mp_fm_tat_award_008",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Fully Modded",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.730000",
                        "_y": "0.330000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_009",
                    "txdHash": "mp_fm_tat_award_009",
                    "txtHash": "mp_fm_tat_award_009",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Revenge Kill",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.700000",
                        "_y": "0.380000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "88.559998"
                    },
                    "nameHash": "FM_Tat_Award_F_010",
                    "txdHash": "mp_fm_tat_award_010",
                    "txtHash": "mp_fm_tat_award_010",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Kill 3 Racers",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.170000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "-5.400000"
                    },
                    "nameHash": "FM_Tat_Award_F_011",
                    "txdHash": "mp_fm_tat_award_011",
                    "txtHash": "mp_fm_tat_award_011",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Reach Rank",
                    "awardLevel": "1"
                },
                {
                    "uvPos": {
                        "_x": "-0.170000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "-5.400000"
                    },
                    "nameHash": "FM_Tat_Award_F_012",
                    "txdHash": "mp_fm_tat_award_012",
                    "txtHash": "mp_fm_tat_award_012",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Reach Rank",
                    "awardLevel": "2"
                },
                {
                    "uvPos": {
                        "_x": "-0.170000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "-5.400000"
                    },
                    "nameHash": "FM_Tat_Award_F_013",
                    "txdHash": "mp_fm_tat_award_013",
                    "txtHash": "mp_fm_tat_award_013",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Reach Rank",
                    "awardLevel": "3"
                },
                {
                    "uvPos": {
                        "_x": "0.220000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "-4.600000"
                    },
                    "nameHash": "FM_Tat_Award_F_014",
                    "txdHash": "mp_fm_tat_award_014",
                    "txtHash": "mp_fm_tat_award_014",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Putting The Sneak to Sleep",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.490000",
                        "_y": "0.800000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_015",
                    "txdHash": "mp_fm_tat_award_015",
                    "txtHash": "mp_fm_tat_award_015",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "The Champion",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.245000",
                        "_y": "0.390000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_016",
                    "txdHash": "mp_fm_tat_award_016",
                    "txtHash": "mp_fm_tat_award_016",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Armed Robber",
                    "awardLevel": "1"
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.245000",
                        "_y": "0.390000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_017",
                    "txdHash": "mp_fm_tat_award_017",
                    "txtHash": "mp_fm_tat_award_017",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Armed Robber",
                    "awardLevel": "2"
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.245000",
                        "_y": "0.390000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_018",
                    "txdHash": "mp_fm_tat_award_018",
                    "txtHash": "mp_fm_tat_award_018",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Armed Robber",
                    "awardLevel": "3"
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.245000",
                        "_y": "0.390000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_Award_F_019",
                    "txdHash": "mp_fm_tat_award_019",
                    "txtHash": "mp_fm_tat_award_019",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Armed Robber",
                    "awardLevel": "4"
                },
                {
                    "uvPos": {
                        "_x": "0.530000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.320000",
                        "_y": "0.320000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_001",
                    "txdHash": "mp_fm_tat_001",
                    "txtHash": "mp_fm_tat_001",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.330000",
                        "_y": "0.450000"
                    },
                    "scale": {
                        "_x": "0.460000",
                        "_y": "0.350000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_002",
                    "txdHash": "mp_fm_tat_002",
                    "txtHash": "mp_fm_tat_002",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.780000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_003",
                    "txdHash": "mp_fm_tat_003",
                    "txtHash": "mp_fm_tat_003",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.730000",
                        "_y": "0.360000"
                    },
                    "scale": {
                        "_x": "0.270000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_004",
                    "txdHash": "mp_fm_tat_004",
                    "txtHash": "mp_fm_tat_004",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.440000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_005",
                    "txdHash": "mp_fm_tat_005",
                    "txtHash": "mp_fm_tat_005",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.060000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.147000",
                        "_y": "0.320000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_006",
                    "txdHash": "mp_fm_tat_006",
                    "txtHash": "mp_fm_tat_006",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.040000",
                        "_y": "0.300000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.240000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_007",
                    "txdHash": "mp_fm_tat_007",
                    "txtHash": "mp_fm_tat_007",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.250000",
                        "_y": "0.380000"
                    },
                    "scale": {
                        "_x": "-0.192000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_008",
                    "txdHash": "mp_fm_tat_008",
                    "txtHash": "mp_fm_tat_008",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.330000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_009",
                    "txdHash": "mp_fm_tat_009",
                    "txtHash": "mp_fm_tat_009",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.650000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.130000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_010",
                    "txdHash": "mp_fm_tat_010",
                    "txtHash": "mp_fm_tat_010",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.140000",
                        "_y": "0.720000"
                    },
                    "scale": {
                        "_x": "0.080000",
                        "_y": "0.080000"
                    },
                    "rotation": {
                        "_value": "9.720000"
                    },
                    "nameHash": "FM_Tat_F_011",
                    "txdHash": "mp_fm_tat_011",
                    "txtHash": "mp_fm_tat_011",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.740000",
                        "_y": "0.345000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_012",
                    "txdHash": "mp_fm_tat_012",
                    "txtHash": "mp_fm_tat_012",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.330000",
                        "_y": "0.730000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_013",
                    "txdHash": "mp_fm_tat_013",
                    "txtHash": "mp_fm_tat_013",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.100000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.147000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_014",
                    "txdHash": "mp_fm_tat_014",
                    "txtHash": "mp_fm_tat_014",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.470000",
                        "_y": "0.870000"
                    },
                    "scale": {
                        "_x": "0.070000",
                        "_y": "0.080000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_015",
                    "txdHash": "mp_fm_tat_015",
                    "txtHash": "mp_fm_tat_015",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.220000",
                        "_y": "0.560000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_016",
                    "txdHash": "mp_fm_tat_016",
                    "txtHash": "mp_fm_tat_016",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.680000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.232000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_017",
                    "txdHash": "mp_fm_tat_017",
                    "txtHash": "mp_fm_tat_017",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.480000",
                        "_y": "0.540000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_018",
                    "txdHash": "mp_fm_tat_018",
                    "txtHash": "mp_fm_tat_018",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.540000"
                    },
                    "scale": {
                        "_x": "0.330000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_019",
                    "txdHash": "mp_fm_tat_019",
                    "txtHash": "mp_fm_tat_019",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.325000",
                        "_y": "0.290000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_020",
                    "txdHash": "mp_fm_tat_020",
                    "txtHash": "mp_fm_tat_020",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.360000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_021",
                    "txdHash": "mp_fm_tat_021",
                    "txtHash": "mp_fm_tat_021",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.800000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_022",
                    "txdHash": "mp_fm_tat_022",
                    "txtHash": "mp_fm_tat_022",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.230000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_023",
                    "txdHash": "mp_fm_tat_023",
                    "txtHash": "mp_fm_tat_023",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.730000",
                        "_y": "0.510000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_024",
                    "txdHash": "mp_fm_tat_024",
                    "txtHash": "mp_fm_tat_024",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.670000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.080000",
                        "_y": "0.080000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_025",
                    "txdHash": "mp_fm_tat_025",
                    "txtHash": "mp_fm_tat_025",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.240000",
                        "_y": "0.300000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_026",
                    "txdHash": "mp_fm_tat_026",
                    "txtHash": "mp_fm_tat_026",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.490000",
                        "_y": "0.780000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_027",
                    "txdHash": "mp_fm_tat_027",
                    "txtHash": "mp_fm_tat_027",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.540000",
                        "_y": "0.440000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_028",
                    "txdHash": "mp_fm_tat_028",
                    "txtHash": "mp_fm_tat_028",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.800000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_029",
                    "txdHash": "mp_fm_tat_029",
                    "txtHash": "mp_fm_tat_029",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.230000",
                        "_y": "0.740000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_030",
                    "txdHash": "mp_fm_tat_030",
                    "txtHash": "mp_fm_tat_030",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.528000",
                        "_y": "0.800000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_031",
                    "txdHash": "mp_fm_tat_031",
                    "txtHash": "mp_fm_tat_031",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.260000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_032",
                    "txdHash": "mp_fm_tat_032",
                    "txtHash": "mp_fm_tat_032",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.160000",
                        "_y": "0.360000"
                    },
                    "scale": {
                        "_x": "0.400000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_033",
                    "txdHash": "mp_fm_tat_033",
                    "txtHash": "mp_fm_tat_033",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.650000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_034",
                    "txdHash": "mp_fm_tat_034",
                    "txtHash": "mp_fm_tat_034",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "1.100000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.260000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_035",
                    "txdHash": "mp_fm_tat_035",
                    "txtHash": "mp_fm_tat_035",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.736000",
                        "_y": "0.375000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.120000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_036",
                    "txdHash": "mp_fm_tat_036",
                    "txtHash": "mp_fm_tat_036",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.250000",
                        "_y": "0.320000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.230000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_037",
                    "txdHash": "mp_fm_tat_037",
                    "txtHash": "mp_fm_tat_037",
                    "zone": "4",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.450000",
                        "_y": "0.430000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "-180.000000"
                    },
                    "nameHash": "FM_Tat_F_038",
                    "txdHash": "mp_fm_tat_038",
                    "txtHash": "mp_fm_tat_038",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_039",
                    "txdHash": "mp_fm_tat_039",
                    "txtHash": "mp_fm_tat_039",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.280000",
                        "_y": "0.560000"
                    },
                    "scale": {
                        "_x": "0.400000",
                        "_y": "0.400000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_040",
                    "txdHash": "mp_fm_tat_040",
                    "txtHash": "mp_fm_tat_040",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.870000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_041",
                    "txdHash": "mp_fm_tat_041",
                    "txtHash": "mp_fm_tat_041",
                    "zone": "2",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "1.200000",
                        "_y": "0.400000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_042",
                    "txdHash": "mp_fm_tat_042",
                    "txtHash": "mp_fm_tat_042",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.350000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_043",
                    "txdHash": "mp_fm_tat_043",
                    "txtHash": "mp_fm_tat_043",
                    "zone": "5",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.730000",
                        "_y": "0.520000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_044",
                    "txdHash": "mp_fm_tat_044",
                    "txtHash": "mp_fm_tat_044",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.246000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.380000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_045",
                    "txdHash": "mp_fm_tat_045",
                    "txtHash": "mp_fm_tat_045",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.225000",
                        "_y": "0.555000"
                    },
                    "scale": {
                        "_x": "0.300000",
                        "_y": "0.280000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_046",
                    "txdHash": "mp_fm_tat_046",
                    "txtHash": "mp_fm_tat_046",
                    "zone": "0",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.460000",
                        "_y": "0.850000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.140000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tat_F_047",
                    "txdHash": "mp_fm_tat_047",
                    "txtHash": "mp_fm_tat_047",
                    "zone": "3",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.170000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_000",
                    "txdHash": "mp_fm_tshirt_award_000",
                    "txtHash": "mp_fm_tshirt_award_000",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Survivor",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_001",
                    "txdHash": "mp_fm_tshirt_award_001",
                    "txtHash": "mp_fm_tshirt_award_001",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "DLC Crate",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_002",
                    "txdHash": "mp_fm_tshirt_award_002",
                    "txtHash": "mp_fm_tshirt_award_002",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "Rockstar Verified",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_F_000",
                    "txdHash": "mp_fm_tshirt_award_000",
                    "txtHash": "mp_fm_tshirt_award_000",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Survivor",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_F_001",
                    "txdHash": "mp_fm_tshirt_award_001",
                    "txtHash": "mp_fm_tshirt_award_001",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "DLC Crate",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.100000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_Tshirt_Award_F_002",
                    "txdHash": "mp_fm_tshirt_award_002",
                    "txtHash": "mp_fm_tshirt_award_002",
                    "zone": "0",
                   "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "Rockstar Verified",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_003_a",
                    "txdHash": "mp_fm_f_hair_003_a",
                    "txtHash": "mp_fm_f_hair_003_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_003_b",
                    "txdHash": "mp_fm_f_hair_003_b",
                    "txtHash": "mp_fm_f_hair_003_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_003_c",
                    "txdHash": "mp_fm_f_hair_003_c",
                    "txtHash": "mp_fm_f_hair_003_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_003_d",
                    "txdHash": "mp_fm_f_hair_003_d",
                    "txtHash": "mp_fm_f_hair_003_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_003_e",
                    "txdHash": "mp_fm_f_hair_003_e",
                    "txtHash": "mp_fm_f_hair_003_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_005_a",
                    "txdHash": "mp_fm_f_hair_005_a",
                    "txtHash": "mp_fm_f_hair_005_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_005_b",
                    "txdHash": "mp_fm_f_hair_005_b",
                    "txtHash": "mp_fm_f_hair_005_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_005_c",
                    "txdHash": "mp_fm_f_hair_005_c",
                    "txtHash": "mp_fm_f_hair_005_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_005_d",
                    "txdHash": "mp_fm_f_hair_005_d",
                    "txtHash": "mp_fm_f_hair_005_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_005_e",
                    "txdHash": "mp_fm_f_hair_005_e",
                    "txtHash": "mp_fm_f_hair_005_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_006_a",
                    "txdHash": "mp_fm_f_hair_006_a",
                    "txtHash": "mp_fm_f_hair_006_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_006_b",
                    "txdHash": "mp_fm_f_hair_006_b",
                    "txtHash": "mp_fm_f_hair_006_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_006_c",
                    "txdHash": "mp_fm_f_hair_006_c",
                    "txtHash": "mp_fm_f_hair_006_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_006_d",
                    "txdHash": "mp_fm_f_hair_006_d",
                    "txtHash": "mp_fm_f_hair_006_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_006_e",
                    "txdHash": "mp_fm_f_hair_006_e",
                    "txtHash": "mp_fm_f_hair_006_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_013_a",
                    "txdHash": "mp_fm_f_hair_013_a",
                    "txtHash": "mp_fm_f_hair_013_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_013_b",
                    "txdHash": "mp_fm_f_hair_013_b",
                    "txtHash": "mp_fm_f_hair_013_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_013_c",
                    "txdHash": "mp_fm_f_hair_013_c",
                    "txtHash": "mp_fm_f_hair_013_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_013_d",
                    "txdHash": "mp_fm_f_hair_013_d",
                    "txtHash": "mp_fm_f_hair_013_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_013_e",
                    "txdHash": "mp_fm_f_hair_013_e",
                    "txtHash": "mp_fm_f_hair_013_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_014_a",
                    "txdHash": "mp_fm_f_hair_014_a",
                    "txtHash": "mp_fm_f_hair_014_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_014_b",
                    "txdHash": "mp_fm_f_hair_014_b",
                    "txtHash": "mp_fm_f_hair_014_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_014_c",
                    "txdHash": "mp_fm_f_hair_014_c",
                    "txtHash": "mp_fm_f_hair_014_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_014_d",
                    "txdHash": "mp_fm_f_hair_014_d",
                    "txtHash": "mp_fm_f_hair_014_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_014_e",
                    "txdHash": "mp_fm_f_hair_014_e",
                    "txtHash": "mp_fm_f_hair_014_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_long_a",
                    "txdHash": "mp_fm_f_hair_long_a",
                    "txtHash": "mp_fm_f_hair_long_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_long_b",
                    "txdHash": "mp_fm_f_hair_long_b",
                    "txtHash": "mp_fm_f_hair_long_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_long_c",
                    "txdHash": "mp_fm_f_hair_long_c",
                    "txtHash": "mp_fm_f_hair_long_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_long_d",
                    "txdHash": "mp_fm_f_hair_long_d",
                    "txtHash": "mp_fm_f_hair_long_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_F_Hair_long_e",
                    "txdHash": "mp_fm_f_hair_long_e",
                    "txtHash": "mp_fm_f_hair_long_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_001_a",
                    "txdHash": "mp_fm_m_hair_001_a",
                    "txtHash": "mp_fm_m_hair_001_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_001_b",
                    "txdHash": "mp_fm_m_hair_001_b",
                    "txtHash": "mp_fm_m_hair_001_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_001_c",
                    "txdHash": "mp_fm_m_hair_001_c",
                    "txtHash": "mp_fm_m_hair_001_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_001_d",
                    "txdHash": "mp_fm_m_hair_001_d",
                    "txtHash": "mp_fm_m_hair_001_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_001_e",
                    "txdHash": "mp_fm_m_hair_001_e",
                    "txtHash": "mp_fm_m_hair_001_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_003_a",
                    "txdHash": "mp_fm_m_hair_003_a",
                    "txtHash": "mp_fm_m_hair_003_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_003_b",
                    "txdHash": "mp_fm_m_hair_003_b",
                    "txtHash": "mp_fm_m_hair_003_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_003_c",
                    "txdHash": "mp_fm_m_hair_003_c",
                    "txtHash": "mp_fm_m_hair_003_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_003_d",
                    "txdHash": "mp_fm_m_hair_003_d",
                    "txtHash": "mp_fm_m_hair_003_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_003_e",
                    "txdHash": "mp_fm_m_hair_003_e",
                    "txtHash": "mp_fm_m_hair_003_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_006_a",
                    "txdHash": "mp_fm_m_hair_006_a",
                    "txtHash": "mp_fm_m_hair_006_a",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_006_b",
                    "txdHash": "mp_fm_m_hair_006_b",
                    "txtHash": "mp_fm_m_hair_006_b",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_006_c",
                    "txdHash": "mp_fm_m_hair_006_c",
                    "txtHash": "mp_fm_m_hair_006_c",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_006_d",
                    "txdHash": "mp_fm_m_hair_006_d",
                    "txtHash": "mp_fm_m_hair_006_d",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_006_e",
                    "txdHash": "mp_fm_m_hair_006_e",
                    "txtHash": "mp_fm_m_hair_006_e",
                    "zone": "1",
                   "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_008_a",
                    "txdHash": "mp_fm_m_hair_008_a",
                    "txtHash": "mp_fm_m_hair_008_a",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_008_b",
                    "txdHash": "mp_fm_m_hair_008_b",
                    "txtHash": "mp_fm_m_hair_008_b",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_008_c",
                    "txdHash": "mp_fm_m_hair_008_c",
                    "txtHash": "mp_fm_m_hair_008_c",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_008_d",
                    "txdHash": "mp_fm_m_hair_008_d",
                    "txtHash": "mp_fm_m_hair_008_d",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_008_e",
                    "txdHash": "mp_fm_m_hair_008_e",
                    "txtHash": "mp_fm_m_hair_008_e",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_long_a",
                    "txdHash": "mp_fm_m_hair_long_a",
                    "txtHash": "mp_fm_m_hair_long_a",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_long_b",
                    "txdHash": "mp_fm_m_hair_long_b",
                    "txtHash": "mp_fm_m_hair_long_b",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_long_c",
                    "txdHash": "mp_fm_m_hair_long_c",
                    "txtHash": "mp_fm_m_hair_long_c",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_long_d",
                    "txdHash": "mp_fm_m_hair_long_d",
                    "txtHash": "mp_fm_m_hair_long_d",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.500000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.600000",
                        "_y": "0.500000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "FM_M_Hair_long_e",
                    "txdHash": "mp_fm_m_hair_long_e",
                    "txtHash": "mp_fm_m_hair_long_e",
                    "zone": "1",
                    "type": "TYPE_TATTOO",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.225000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_001",
                    "txdHash": "mp_fm_branding_001",
                    "txtHash": "mp_fm_branding_001",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.660000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_002",
                    "txdHash": "mp_fm_branding_002",
                    "txtHash": "mp_fm_branding_002",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.660000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_003",
                    "txdHash": "mp_fm_branding_003",
                    "txtHash": "mp_fm_branding_003",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_004",
                    "txdHash": "mp_fm_branding_004",
                    "txtHash": "mp_fm_branding_004",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.220000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_005",
                    "txdHash": "mp_fm_branding_005",
                    "txtHash": "mp_fm_branding_005",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.650000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_006",
                    "txdHash": "mp_fm_branding_006",
                    "txtHash": "mp_fm_branding_006",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.580000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_007",
                    "txdHash": "mp_fm_branding_007",
                    "txtHash": "mp_fm_branding_007",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.580000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_008",
                    "txdHash": "mp_fm_branding_008",
                    "txtHash": "mp_fm_branding_008",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.650000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_009",
                    "txdHash": "mp_fm_branding_009",
                    "txtHash": "mp_fm_branding_009",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_010",
                    "txdHash": "mp_fm_branding_010",
                    "txtHash": "mp_fm_branding_010",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_011",
                    "txdHash": "mp_fm_branding_011",
                    "txtHash": "mp_fm_branding_011",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.100000",
                        "_y": "0.450000"
                    },
                    "scale": {
                        "_x": "0.350000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_012",
                    "txdHash": "mp_fm_branding_012",
                    "txtHash": "mp_fm_branding_012",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.610000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_013",
                    "txdHash": "mp_fm_branding_013",
                    "txtHash": "mp_fm_branding_013",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_014",
                    "txdHash": "mp_fm_branding_014",
                    "txtHash": "mp_fm_branding_014",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_015",
                    "txdHash": "mp_fm_branding_015",
                    "txtHash": "mp_fm_branding_015",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.160000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.060000",
                        "_y": "0.060000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_016",
                    "txdHash": "mp_fm_branding_016",
                    "txtHash": "mp_fm_branding_016",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_017",
                    "txdHash": "mp_fm_branding_017",
                    "txtHash": "mp_fm_branding_017",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_018",
                    "txdHash": "mp_fm_branding_018",
                    "txtHash": "mp_fm_branding_018",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.510000"
                    },
                    "scale": {
                        "_x": "0.280000",
                        "_y": "0.250000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_019",
                    "txdHash": "mp_fm_branding_019",
                    "txtHash": "mp_fm_branding_019",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_020",
                    "txdHash": "mp_fm_branding_020",
                    "txtHash": "mp_fm_branding_020",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_022",
                    "txdHash": "mp_fm_branding_022",
                    "txtHash": "mp_fm_branding_022",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.550000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_023",
                    "txdHash": "mp_fm_branding_023",
                    "txtHash": "mp_fm_branding_023",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.250000",
                        "_y": "0.800000"
                    },
                    "scale": {
                        "_x": "0.090000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_024",
                    "txdHash": "mp_fm_branding_024",
                    "txtHash": "mp_fm_branding_024",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_025",
                    "txdHash": "mp_fm_branding_025",
                    "txtHash": "mp_fm_branding_025",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.236000",
                        "_y": "0.540000"
                    },
                    "scale": {
                        "_x": "0.140000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_027",
                    "txdHash": "mp_fm_branding_027",
                    "txtHash": "mp_fm_branding_027",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_028",
                    "txdHash": "mp_fm_branding_028",
                    "txtHash": "mp_fm_branding_028",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_029",
                    "txdHash": "mp_fm_branding_029",
                    "txtHash": "mp_fm_branding_029",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_031",
                    "txdHash": "mp_fm_branding_031",
                    "txtHash": "mp_fm_branding_031",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_032",
                    "txdHash": "mp_fm_branding_032",
                    "txtHash": "mp_fm_branding_032",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_034",
                    "txdHash": "mp_fm_branding_034",
                    "txtHash": "mp_fm_branding_034",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_035",
                    "txdHash": "mp_fm_branding_035",
                    "txtHash": "mp_fm_branding_035",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.500000"
                    },
                    "scale": {
                        "_x": "0.340000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_036",
                    "txdHash": "mp_fm_branding_036",
                    "txtHash": "mp_fm_branding_036",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.560000"
                    },
                    "scale": {
                        "_x": "0.160000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_037",
                    "txdHash": "mp_fm_branding_037",
                    "txtHash": "mp_fm_branding_037",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_002",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.240000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_038",
                    "txdHash": "mp_fm_branding_038",
                    "txtHash": "mp_fm_branding_038",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_039",
                    "txdHash": "mp_fm_branding_039",
                    "txtHash": "mp_fm_branding_039",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_040",
                    "txdHash": "mp_fm_branding_040",
                    "txtHash": "mp_fm_branding_040",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.240000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_041",
                    "txdHash": "mp_fm_branding_041",
                    "txtHash": "mp_fm_branding_041",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.175000",
                        "_y": "0.660000"
                    },
                    "scale": {
                        "_x": "0.080000",
                        "_y": "0.080000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_042",
                    "txdHash": "mp_fm_branding_042",
                    "txtHash": "mp_fm_branding_042",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.620000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.140000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_043",
                    "txdHash": "mp_fm_branding_043",
                    "txtHash": "mp_fm_branding_043",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.175000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_044",
                    "txdHash": "mp_fm_branding_044",
                    "txtHash": "mp_fm_branding_044",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.160000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_045",
                    "txdHash": "mp_fm_branding_045",
                    "txtHash": "mp_fm_branding_045",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_008",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.200000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_046",
                    "txdHash": "mp_fm_branding_046",
                    "txtHash": "mp_fm_branding_046",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_001",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.660000"
                    },
                    "scale": {
                        "_x": "0.200000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_047",
                    "txdHash": "mp_fm_branding_047",
                    "txtHash": "mp_fm_branding_047",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "M_Jbib_000",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.520000"
                    },
                    "scale": {
                        "_x": "0.140000",
                        "_y": "0.140000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_048",
                    "txdHash": "mp_fm_branding_048",
                    "txtHash": "mp_fm_branding_048",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_000",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.140000",
                        "_y": "0.140000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_049",
                    "txdHash": "mp_fm_branding_049",
                    "txtHash": "mp_fm_branding_049",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_004",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.120000",
                        "_y": "0.110000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_050",
                    "txdHash": "mp_fm_branding_050",
                    "txtHash": "mp_fm_branding_050",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_004",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_051",
                    "txdHash": "mp_fm_branding_051",
                    "txtHash": "mp_fm_branding_051",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_004",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.258000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.145000",
                        "_y": "0.145000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_052",
                    "txdHash": "mp_fm_branding_052",
                    "txtHash": "mp_fm_branding_052",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_002",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.258000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_053",
                    "txdHash": "mp_fm_branding_053",
                    "txtHash": "mp_fm_branding_053",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_002",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.258000",
                        "_y": "0.530000"
                    },
                    "scale": {
                        "_x": "0.145000",
                        "_y": "0.145000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_054",
                    "txdHash": "mp_fm_branding_054",
                    "txtHash": "mp_fm_branding_054",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_002",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.258000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.145000",
                        "_y": "0.145000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_055",
                    "txdHash": "mp_fm_branding_055",
                    "txtHash": "mp_fm_branding_055",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_002",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.260000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.160000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_056",
                    "txdHash": "mp_fm_branding_056",
                    "txtHash": "mp_fm_branding_056",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_002",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_057",
                    "txdHash": "mp_fm_branding_057",
                    "txtHash": "mp_fm_branding_057",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "-12.960000"
                    },
                    "nameHash": "mp_fm_branding_058",
                    "txdHash": "mp_fm_branding_058",
                    "txtHash": "mp_fm_branding_058",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_003",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.720000"
                    },
                    "nameHash": "mp_fm_branding_059",
                    "txdHash": "mp_fm_branding_059",
                    "txtHash": "mp_fm_branding_059",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_003",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.180000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.050000",
                        "_y": "0.050000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_060",
                    "txdHash": "mp_fm_branding_060",
                    "txtHash": "mp_fm_branding_060",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_003",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.070000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_061",
                    "txdHash": "mp_fm_branding_061",
                    "txtHash": "mp_fm_branding_061",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_005",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.570000"
                    },
                    "scale": {
                        "_x": "0.100000",
                        "_y": "0.070000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_062",
                    "txdHash": "mp_fm_branding_062",
                    "txtHash": "mp_fm_branding_062",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_005",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.590000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_066",
                    "txdHash": "mp_fm_branding_066",
                    "txtHash": "mp_fm_branding_066",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.590000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_067",
                    "txdHash": "mp_fm_branding_067",
                    "txtHash": "mp_fm_branding_067",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.250000",
                        "_y": "0.590000"
                    },
                    "scale": {
                        "_x": "0.126000",
                        "_y": "0.126000"
                    },
                    "rotation": {
                        "_value": "12.960000"
                    },
                    "nameHash": "mp_fm_branding_068",
                    "txdHash": "mp_fm_branding_068",
                    "txtHash": "mp_fm_branding_068",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.520000"
                    },
                    "scale": {
                        "_x": "0.126000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_069",
                    "txdHash": "mp_fm_branding_069",
                    "txtHash": "mp_fm_branding_069",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.580000"
                    },
                    "scale": {
                        "_x": "0.126000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_070",
                    "txdHash": "mp_fm_branding_070",
                    "txtHash": "mp_fm_branding_070",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.490000"
                    },
                    "scale": {
                        "_x": "0.110000",
                        "_y": "0.160000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_027_f",
                    "txdHash": "mp_fm_branding_027",
                    "txtHash": "mp_fm_branding_027",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_000",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_028_F",
                    "txdHash": "mp_fm_branding_028",
                    "txtHash": "mp_fm_branding_028",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_011",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.580000"
                    },
                    "scale": {
                        "_x": "0.130000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_034_f",
                    "txdHash": "mp_fm_branding_034",
                    "txtHash": "mp_fm_branding_034",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_000",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.770000",
                        "_y": "0.590000"
                    },
                    "scale": {
                        "_x": "0.350000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_036_F",
                    "txdHash": "mp_fm_branding_036",
                    "txtHash": "mp_fm_branding_036",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_003",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.264000",
                        "_y": "0.480000"
                    },
                    "scale": {
                        "_x": "0.150000",
                        "_y": "0.150000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_branding_039_f",
                    "txdHash": "mp_fm_branding_039",
                    "txtHash": "mp_fm_branding_039",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "F_Jbib_004",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "0.234000",
                        "_y": "0.710000"
                    },
                    "scale": {
                        "_x": "0.250000",
                        "_y": "0.300000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "",
                    "txdHash": "",
                    "txtHash": "",
                    "zone": "ZONE_INVALID",
                    "type": "TYPE_INVALID",
                    "faction": "",
                    "garment": "All",
                    "gender": "GENDER_DONTCARE",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_000_m",
                    "txdHash": "MP_FM_OG_Award_000",
                    "txtHash": "MP_FM_OG_Award_000",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.267000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_001_m",
                    "txdHash": "MP_FM_OG_Award_001",
                    "txtHash": "MP_FM_OG_Award_001",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.270000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_002_m",
                    "txdHash": "MP_FM_OG_Award_002",
                    "txtHash": "MP_FM_OG_Award_002",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.267000",
                        "_y": "0.630000"
                    },
                    "scale": {
                        "_x": "0.180000",
                        "_y": "0.180000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_003_m",
                    "txdHash": "MP_FM_OG_Award_003",
                    "txtHash": "MP_FM_OG_Award_003",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "1",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.290000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.170000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_000_f",
                    "txdHash": "MP_FM_OG_Award_000",
                    "txtHash": "MP_FM_OG_Award_000",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.285000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.170000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_001_f",
                    "txdHash": "MP_FM_OG_Award_001",
                    "txtHash": "MP_FM_OG_Award_001",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.290000",
                        "_y": "0.600000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.170000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_002_f",
                    "txdHash": "MP_FM_OG_Award_002",
                    "txtHash": "MP_FM_OG_Award_002",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                },
                {
                    "uvPos": {
                        "_x": "-0.285000",
                        "_y": "0.670000"
                    },
                    "scale": {
                        "_x": "0.170000",
                        "_y": "0.170000"
                    },
                    "rotation": {
                        "_value": "0.000000"
                    },
                    "nameHash": "mp_fm_OGA_003_f",
                    "txdHash": "MP_FM_OG_Award_003",
                    "txtHash": "MP_FM_OG_Award_003",
                    "zone": "0",
                    "type": "TYPE_BADGE",
                    "faction": "FM",
                    "garment": "All",
                    "gender": "0",
                    "award": "",
                    "awardLevel": ""
                }
            ]
        },
        "nameHash": "multiplayer_overlays",
        "medalLocations": {
            "_content": "vector2_array",
            "__text": "0.140000\t0.070000\t\n    0.370000\t0.070000\t\n    0.600000\t0.070000\t\n    0.835000\t0.070000\t\n    0.140000\t0.150000\t\n    0.370000\t0.150000\t\n    0.600000\t0.150000\t\n    0.835000\t0.150000\t\n    0.140000\t0.230000\t\n    0.370000\t0.230000\t\n    0.600000\t0.230000\t\n    0.835000\t0.230000\t\n    0.100000\t0.700000\t\n    0.300000\t0.700000\t\n    0.500000\t0.700000\t\n    0.700000\t0.700000"
        },
        "medalScale": {
            "_x": "0.240000",
            "_y": "0.100000"
        }
    }
};

export enum TattooZones {
    ZONE_TORSO = 0,
    ZONE_HEAD = 1,
    ZONE_LEFT_ARM = 2,
    ZONE_RIGHT_ARM = 3,
    ZONE_LEFT_LEG = 4,
    ZONE_RIGHT_LEG = 5
}

class helperTattoos {
    zone: number;
    nameHash: string;
    gender: boolean;

    constructor(zone: number, nameHash: string, gender: boolean) {
        this.zone = zone;
        this.nameHash = nameHash;
        this.gender = gender;
    }
};

class helperPlayerTattoo {
    nameHash: string;
    zone: number;

    constructor(nameHash: string, zone: number) {
        this.nameHash = nameHash;
        this.zone = zone;
    }
}

export class TattooServer {

    list: helperTattoos[] = [];
    position: Vector3Mp;
    blip: BlipMp;
    marker: MarkerMp;

    constructor(position: Vector3Mp) {
        this.position = position;

        if (!mp.blips.exists(this.blip))
            this.blip = mp.blips.new(79, this.position, { scale: 1.0, shortRange: true, name: "Tattooshop" });

        if (!mp.markers.exists(this.marker))
            this.marker = mp.markers.new(1, this.position, 1.0, { color: [0, 200, 100, 100] });
    }

    loadTattosFromJson() {
        jsonTattoos.PedDecorationCollection.presets.Item.forEach((element) => {
            if (element.nameHash.indexOf("Tat") > -1)
                this.list.push(new helperTattoos(parseInt(element.zone), element.nameHash, parseInt(element.gender) ? true : false));
        });
    }

    getMaxTattooZones() {
        return (Object.keys(TattooZones).length / 2);
    }

    getMaxTattoos(tattooZoneId: TattooZones, gender: boolean) {

        var returnValue = 0;

        this.list.forEach((element: helperTattoos) => {

            if (element.zone != tattooZoneId)
                return false;

            if (element.gender != gender)
                return false;

            returnValue++;

        });
        return returnValue - 1;
    }

    getTattooOnIndex(index: number, zone: number, gender: boolean) {
        var tempTattoo: helperTattoos[] = [];

        this.list.forEach((element: helperTattoos) => {

            if (element.zone != zone)
                return false;

            if (element.gender != gender)
                return false;

            tempTattoo.push(element);

        });

        if (tempTattoo[index])
            return tempTattoo[index];
        else
            return undefined;
    }

    canPlayerEnterShop(player: Player) {
        if (Distance(player.position, this.position) > 4)
            return false;

        return true;
    }
}


export class TattooPlayer {
    player: Player;
    tattoes: helperPlayerTattoo[] = [];
    selectionCounter: number = 0;

    constructor(player: Player) {
        this.player = player;
    }

    addTattoo(nameHash: string, zone: number) {
        var tattoo = this.tattoes.find(element => element.nameHash == nameHash);

        if (tattoo)
            return false;
        else {
            this.tattoes.push(new helperPlayerTattoo(nameHash, zone));
            this.player.setDecoration(mp.joaat("multiplayer_overlays"), mp.joaat(nameHash));
        }

    }

    hasTattoo(zone: number) {

        var count = 0;

        this.tattoes.forEach((element) => {

            if(element.zone != zone)
                return false;

            count++;

        });

        if(count < 3)
            return false;
        else
            return true;
    }


    hasTattooByName(nameHash: string) {
        var tattoo = this.tattoes.find(element => element.nameHash == nameHash);

        if (tattoo)
            return true;
        else
            return false;
    }

    placeAllTattoes() {
        this.player.clearDecorations();

        this.tattoes.forEach((element: helperPlayerTattoo) => {
            this.player.setDecoration(mp.joaat("multiplayer_overlays"), mp.joaat(element.nameHash));
        });
    }

    loadTattoesFromDatabase() {
        database.then(connection => {

            connection.getRepository(Tattooes).find({ where: { name: this.player.name } }).then((elements) => {

                if (!mp.players.exists(this.player))
                    return false;

                elements.forEach((element: Tattooes) => {

                    this.addTattoo(element.hash, element.zone);

                });

            });

        });
    }
}

var ServerTattoo = new TattooServer(new mp.Vector3(-1151.2423095703125, -1425.88623046875, 4.0446252822876));
ServerTattoo.loadTattosFromJson();

mp.events.add("server:OpenTattooEditor", (player: Player) => {

    if (!ServerTattoo.canPlayerEnterShop(player))
        return false;

    player.call("client:OpenTattooEditor", []);
    player.dimension = player.id + 1;

});

mp.events.add("server:ChangedTattooZone", (player: Player, zone: number) => {
    if (player.tattoo.hasTattoo(zone)) {
        player.call("client:SetTattooStatus", [true]);

    }

    else {
        player.call("client:SetTattooStatus", [false]);
    }

});

mp.events.add("server:TattooSelect", (player: Player, zone: number, side: boolean) => {

    if (player.tattoo.hasTattoo(zone))
        player.call("client:SetTattooStatus", [true]);
    else
        player.call("client:SetTattooStatus", [false]);

    if (side == false) {
        player.tattoo.selectionCounter--;

        if (player.tattoo.selectionCounter < 0)
            player.tattoo.selectionCounter = ServerTattoo.getMaxTattoos(zone, player.character.gender);
    }
    else {
        player.tattoo.selectionCounter++;

        if (player.tattoo.selectionCounter > ServerTattoo.getMaxTattoos(zone, player.character.gender))
            player.tattoo.selectionCounter = 0;
    }

    var tattoo = ServerTattoo.getTattooOnIndex(player.tattoo.selectionCounter, zone, player.character.gender);

    player.tattoo.placeAllTattoes();

    if (tattoo) {

        if (player.tattoo.hasTattooByName(tattoo.nameHash))
            return false;

        player.setDecoration(mp.joaat("multiplayer_overlays"), mp.joaat(tattoo.nameHash))
    }
});

mp.events.add("server:TattooPlace", (player: Player, zone: number) => {

    if (player.inventory.getAmount("Dollar") < 10000)
        return overlayError(player, "Du hast nicht genügend Geld für dieses Tattoo!", "Fehler");

    var tattoo = ServerTattoo.getTattooOnIndex(player.tattoo.selectionCounter, zone, player.character.gender);

    if (tattoo) {
        if (player.tattoo.hasTattoo(zone))
            return overlayError(player, "Du besitzt bereits ein Tattoo auf diesem Körperteil.", "Fehler");

        player.tattoo.addTattoo(tattoo.nameHash, zone);
        overlaySuccess(player, "Du hast dieses Tattoo gekauft!", "Fehler");

        database.then(connection => {

            if (!mp.players.exists(player))
                return false;

            if(!tattoo)
            return false;

            connection.getRepository(Tattooes).findOne({ where: {name: player.name, hash: tattoo.nameHash, zone: zone}}).then((element : Tattooes) => {

                if(!mp.players.exists(player))
                    return false;

                if(!tattoo)
                    return false;

                if(!element)
                {
                    var tempTattoo = new Tattooes();

                    tempTattoo.hash = tattoo.nameHash;
                    tempTattoo.zone = zone;
                    tempTattoo.name = player.name;
                    
                    connection.getRepository(Tattooes).save(tempTattoo);

                    player.inventory.removeAmount("Dollar", 10000);
                }

            });
        });

        player.call("client:PlayTattooSound", []);

        player.tattoo.placeAllTattoes();
    }

    if (player.tattoo.hasTattoo(zone))
        player.call("client:SetTattooStatus", [true]);
    else
        player.call("client:SetTattooStatus", [false]);

});

mp.events.add("server:ClosedTattooEditor", (player: Player) => {
    player.tattoo.placeAllTattoes();
    player.dimension = 0;
});


mp.events.addCommand("tat", (player: Player) => {
    player.position = ServerTattoo.position;
});