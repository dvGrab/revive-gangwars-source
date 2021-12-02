/*
	Alle Scripts sind Eigentum von Revive Gangwars, Revive Roleplay und Revive Network.
	Jegliches kopieren und stehlen der Arbeit wird seitens RAGEMP bestraft.
	Sollte dieser Code in anderen Projekten gefunden werden, wird dies sofort weitergegeben.
*/

function Distance(from: Vector3Mp, to: Vector3Mp) {
    var tempDistance = mp.game.system.vdist(from.x, from.y, from.z, to.x, to.y, to.z);
    return tempDistance;
}

class StreamEntities {
    model: string;
    position: Vector3Mp;
    rotation: Vector3Mp;
    w: number;

    handle: number;

    constructor(model: string, position: Vector3Mp, rotation: Vector3Mp, w: number) {
        this.model = model;
        this.position = position;
        this.rotation = rotation;
        this.w = w;
    }
}

class StreamObject {

    objects: StreamEntities[] = [];
    name: string;
    isStreamed: boolean = false;

    add(modelRU: string, position: Vector3Mp, rotation: Vector3Mp, w: number) {
        this.objects.push(new StreamEntities(modelRU, position, rotation, w));
    }

    objectCount() {
        return this.objects.length;
    }

    getObjectAtIndex(index: number): StreamEntities | undefined {
        var object = this.objects[index];

        if (object)
            return object;
        else
            return undefined;
    }

    spawnObjects() {
        if (this.isStreamed == true)
            return false;

        this.isStreamed = true;

        this.objects.forEach((element) => {
            element.handle = mp.game.object.createObject(mp.game.joaat(element.model), 0, 0, 0, false, true, false);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_COORDS, element.handle, element.position.x, element.position.y, element.position.z, 90, 90, 90, true);
            mp.game.invoke(RageEnums.Natives.Entity.SET_ENTITY_QUATERNION, element.handle, -(element.rotation.x), -(element.rotation.y), -(element.rotation.z), element.w);
            mp.game.invoke(RageEnums.Natives.Entity.FREEZE_ENTITY_POSITION, element.handle, true);
        });
    }

    despawnObjects() {
        if (!this.isStreamed)
            return false;

        this.isStreamed = false;
        this.objects.forEach((element) => {
            mp.game.object.deleteObject(element.handle)
        });

    }

    constructor(name: string) {
        this.name = name;
    }
}

class StreamManager {

    objects: StreamObject[] = [];
    globalStreamRange: number = 250;
    isLoaded: boolean = false;

    constructor(streamRange: number) {
        this.globalStreamRange = streamRange;

	}

    create(name: string) {
        return new Promise((resolveRU, reject) => {
            var found = this.objects.find(element => element.name == name);

            if (!found) {
                this.objects.push(new StreamObject(name));
                resolveRU(this.objects.find(element => element.name == name));
            }
            else
                reject(mp.game.graphics.notify("StreamManager:create()"));
        });

    }

    get(name: string) {
        return new Promise((resolve, reject) => {

            var found = this.objects.find(element => element.name == name);

            if (found)
                resolve(found);
            else
                reject(mp.game.graphics.notify("StreamManager:get()"));
        });
    }

    isPlayerInRangeOfMap(name: string) {
        var result = false;

        this.objects.forEach((element) => {

            if (element.name != name)
                return false;

            if (!element.isStreamed)
                return false;

            var targetObject = element.getObjectAtIndex(0);

            if (!targetObject)
                return false;

            if (Distance(mp.players.local.position, targetObject.position) > this.globalStreamRange)
                return false;

            result = true;
        });

        return result;
    }

    nearestMaps(position: Vector3Mp, range: number) {
        var results: StreamObject[] = [];

        this.objects.forEach((element) => {

            var targetObject = element.getObjectAtIndex(0);

            if (targetObject == undefined)
                return false;

            if (Distance(position, targetObject.position) > range)
                return false;

            results.push(element);
        });

        return results;
    }

    getStreamedMaps() {
        var results: StreamObject[] = [];

        this.objects.forEach((element) => {

            if (!element.isStreamed)
                return false;

            results.push(element);
        });

        return results;
    }

    getNearestObjects(): any | undefined {
        var returnJson: any = { objects: [] }

        this.objects.forEach((element) => {

            if (!element.isStreamed)
                return false;

            element.objects.forEach((targetElement) => {

                if (Distance(mp.players.local.position, targetElement.position) > 10)
                    return false;

                returnJson.objects.push({
                    name: targetElement.model,
                    x: targetElement.position.x,
                    y: targetElement.position.y,
                    z: targetElement.position.z,
                    distance: Distance(mp.players.local.position, targetElement.position)
                });

            });


        });

        return JSON.stringify(returnJson);
	}
	
}

var ObjectStreamer = new StreamManager(250);

var spawnTimer = setInterval(() => {

    if (!ObjectStreamer.isLoaded)
        return false;

    var spots = ObjectStreamer.nearestMaps(mp.players.local.position, ObjectStreamer.globalStreamRange);

    if (spots) {
        spots.forEach((element) => {
            element.spawnObjects();
        });
    }

    var streamedSpots = ObjectStreamer.getStreamedMaps();

    if (streamedSpots) {
        streamedSpots.forEach((element: StreamObject) => {

            if (!element.isStreamed)
                return false;

            if (ObjectStreamer.isPlayerInRangeOfMap(element.name))
                return false;

            element.despawnObjects();

            mp.events.call("client:deleteLootPoints", element.name);

        });
    }

}, 2000);

ObjectStreamer.create("Painball.ymap").then((streamObject: StreamObject) => {
	streamObject.add("prop_haybale_stack_01", new mp.Vector3(2645.01, 4447.012, 39.72046), new mp.Vector3(0, 0, 0.3832269), -0.9236543);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2642.199, 4468.025, 38.93438), new mp.Vector3(0, 0, -0.3865369), 0.9222739);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2636.12, 4461.993, 38.69177), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2630.04, 4455.961, 38.36283), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2623.955, 4449.924, 38.27343), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2617.869, 4443.886, 38.43363), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2611.778, 4437.843, 38.80927), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2611.786, 4437.804, 38.80861), new mp.Vector3(0, 0, -0.396379), -0.918087);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2617.673, 4431.557, 39.0863), new mp.Vector3(0, 0, -0.396379), -0.918087);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2623.553, 4425.316, 39.78571), new mp.Vector3(0, 0, -0.396379), -0.918087);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2629.44, 4419.068, 40.23464), new mp.Vector3(0, 0, -0.3494717), -0.936947);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2635.842, 4413.588, 40.04193), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2641.929, 4419.628, 40.00307), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2648.016, 4425.667, 40.01085), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2654.1, 4431.703, 40.01793), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2660.183, 4437.738, 40.04528), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2666.264, 4443.772, 40.02512), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2672.533, 4461.984, 39.50344), new mp.Vector3(0, 0, 0.3917187), 0.9200851);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2666.592, 4468.163, 39.42347), new mp.Vector3(0, 0, 0.3917187), 0.9200851);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2660.647, 4474.31, 38.9922), new mp.Vector3(0, 0, 0.3917187), 0.9200851);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2654.295, 4480.137, 38.35255), new mp.Vector3(0, 0, 0.3628808), 0.9318356);
	streamObject.add("prop_haybale_stack_01", new mp.Vector3(2655.195, 4454.169, 39.5232), new mp.Vector3(-5.593734E-05, -0.005842207, -0.9189721), -0.3942795);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2632.009, 4418.086, 40.14229), new mp.Vector3(-0.01207145, 0.02259305, 0.4012762), -0.9155989);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2636.1, 4421.196, 39.89029), new mp.Vector3(-0.01188805, 0.02269009, 0.4086793), -0.9123185);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2639.298, 4418.344, 39.90377), new mp.Vector3(-0.01188805, 0.02269009, 0.4086793), -0.9123185);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2639.369, 4418.434, 42.13966), new mp.Vector3(-0.01188805, 0.02269009, 0.4086793), -0.9123185);
	streamObject.add("prop_rub_pile_04", new mp.Vector3(2637.616, 4418.549, 39.85864), new mp.Vector3(0.0008097774, 0.02560294, 0.8045605), -0.593318);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2634.18, 4420.811, 40.1664), new mp.Vector3(0.003441623, -0.0115285, 0.4088378), -0.9125279);
	streamObject.add("prop_fnccorgm_02b", new mp.Vector3(2634.214, 4420.755, 42.30915), new mp.Vector3(0.003441623, -0.0115285, 0.4088378), -0.9125279);
	streamObject.add("prop_fnccorgm_04a", new mp.Vector3(2632.946, 4425.422, 40.07577), new mp.Vector3(0.003915741, -0.003121006, 0.9265161), -0.376222);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2629.469, 4428.691, 40.09643), new mp.Vector3(-0.01002539, 0.002540121, 0.92647), -0.3762264);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2635.068, 4439.357, 40.04861), new mp.Vector3(-0.009141169, 0.008846426, -0.3839291), 0.923275);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2619.054, 4433.996, 39.16974), new mp.Vector3(-0.00513494, -0.0001706923, -0.3940821), 0.9190609);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2622.459, 4437.573, 39.19392), new mp.Vector3(-0.003749562, -0.003401545, -0.3940977), 0.9190546);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2616.448, 4436.685, 39.00008), new mp.Vector3(0.004138486, -0.0217944, -0.3940938), 0.9188024);
	streamObject.add("prop_fnccorgm_05b", new mp.Vector3(2617.115, 4439.555, 38.67566), new mp.Vector3(-0.02951114, 0.0136807, 0.9299759), -0.3661785);
	streamObject.add("prop_fnccorgm_03b", new mp.Vector3(2638.453, 4439.338, 40.02735), new mp.Vector3(0.007963648, -0.00476468, 0.9264901), -0.3762048);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2642.081, 4435.815, 39.90516), new mp.Vector3(0.001636779, -0.002195602, 0.9265229), -0.3762285);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2642.106, 4432.354, 39.77042), new mp.Vector3(-0.005972471, 0.00178258, -0.3940703), 0.9190593);
	streamObject.add("prop_fnccorgm_03b", new mp.Vector3(2634.942, 4435.783, 40.02801), new mp.Vector3(0.004148131, -0.003215366, 0.926515), -0.3762212);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2639.945, 4430.818, 39.73925), new mp.Vector3(-0.003932375, 6.586592E-05, 0.9265159), -0.3762349);
	streamObject.add("prop_pallet_pile_03", new mp.Vector3(2639.153, 4437.382, 39.8827), new mp.Vector3(0.01718506, -0.008508993, 0.9263649), -0.3761387);
	streamObject.add("prop_pallet_pile_03", new mp.Vector3(2639.098, 4437.232, 41.04887), new mp.Vector3(0.01718506, -0.008508993, 0.9263649), -0.3761387);
	streamObject.add("prop_rub_pile_04", new mp.Vector3(2638.142, 4436.091, 39.8797), new mp.Vector3(-0.01789381, 0.0131919, -0.1949184), -0.9805675);
	streamObject.add("prop_rub_pile_04", new mp.Vector3(2638.112, 4436.024, 40.90923), new mp.Vector3(-0.01998293, -0.009741533, -0.9592271), -0.2817609);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2644.897, 4426.001, 39.78993), new mp.Vector3(-0.003932375, 6.586592E-05, 0.9265159), -0.3762349);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2639.972, 4427.365, 39.85199), new mp.Vector3(-0.0005490863, -0.01086481, -0.3941151), 0.9189968);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2636.375, 4430.787, 39.89952), new mp.Vector3(-0.0005490863, -0.01086481, -0.3941151), 0.9189968);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2626.23, 4432.282, 39.86388), new mp.Vector3(-0.03583522, 0.0104718, 0.9001557), -0.4339654);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2629.085, 4423.124, 40.1062), new mp.Vector3(-0.0005490863, -0.01086481, -0.3941151), 0.9189968);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2623.502, 4429.092, 39.83334), new mp.Vector3(-0.005995181, 0.001835548, -0.3940699), 0.9190592);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2631.642, 4440.748, 39.92648), new mp.Vector3(-0.009141169, 0.008846426, -0.3839291), 0.923275);
	streamObject.add("prop_fnccorgm_03a", new mp.Vector3(2635.15, 4444.274, 40.05721), new mp.Vector3(-0.007145109, 0.004046456, -0.3839714), 0.9233086);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2642.123, 4451.291, 39.79703), new mp.Vector3(0.0008566336, -0.01519191, -0.3840369), 0.9231924);
	streamObject.add("prop_fnccorgm_05b", new mp.Vector3(2618.917, 4437.876, 38.83589), new mp.Vector3(-0.02951114, 0.0136807, 0.9299759), -0.3661785);
	streamObject.add("prop_haybale_stack_01", new mp.Vector3(2633.845, 4444.693, 39.68569), new mp.Vector3(-0.05099768, -0.02213426, 0.3975256), -0.9159055);
	streamObject.add("prop_fnccorgm_03a", new mp.Vector3(2628.427, 4446.485, 39.03221), new mp.Vector3(-0.00148393, -0.006150173, 0.929821), 0.3679579);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2641.479, 4425.931, 39.83208), new mp.Vector3(-0.0005490863, -0.01086481, -0.3941151), 0.9189968);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2646.593, 4446.846, 39.73344), new mp.Vector3(0.0008566336, -0.01519191, -0.3840369), 0.9231924);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2659.972, 4451.975, 39.65937), new mp.Vector3(-0.005307124, -0.0003730685, -0.3840012), 0.9233174);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2652.036, 4441.551, 39.68542), new mp.Vector3(0.0008566336, -0.01519191, -0.3840369), 0.9231924);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2654.757, 4438.741, 39.88702), new mp.Vector3(-0.002080032, -0.00813203, -0.3840322), 0.9232816);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2651.277, 4435.241, 39.91794), new mp.Vector3(-0.00732473, 0.004478381, -0.3839681), 0.9233065);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2649.887, 4433.138, 39.88693), new mp.Vector3(-0.004802418, 0.01870958, 0.3767178), 0.9261267);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2653.548, 4453.845, 39.51658), new mp.Vector3(0.0008566336, -0.01519191, -0.3840369), 0.9231924);
	streamObject.add("prop_fnccorgm_02d", new mp.Vector3(2655.83, 4441.805, 39.7096), new mp.Vector3(-0.01153291, 0.002158396, 0.3765718), 0.9263131);
	streamObject.add("prop_haybale_stack_01", new mp.Vector3(2654.152, 4455.536, 39.57002), new mp.Vector3(0.005842152, 6.131269E-05, -0.3757585), 0.9266992);
	streamObject.add("prop_fnccorgm_01b", new mp.Vector3(2648.362, 4448.539, 39.63398), new mp.Vector3(-0.003362453, 0.003631486, -0.9179676), 0.3966244);
	streamObject.add("prop_fnccorgm_01a", new mp.Vector3(2645.713, 4451.405, 39.73478), new mp.Vector3(-0.003362453, 0.003631486, -0.9179676), 0.3966244);
	streamObject.add("prop_pallet_pile_03", new mp.Vector3(2654.089, 4436.475, 39.8254), new mp.Vector3(-0.01867483, 0.006052599, 0.9263361), -0.3761863);
	streamObject.add("prop_pallet_pile_03", new mp.Vector3(2654.072, 4436.486, 41.06715), new mp.Vector3(-0.01896701, 0.005063172, 0.9052942), -0.4243312);
	streamObject.add("prop_rub_pile_04", new mp.Vector3(2652.791, 4437.595, 39.76434), new mp.Vector3(-0.01879701, -0.01176591, -0.918181), -0.3955401);
	streamObject.add("prop_rub_pile_04", new mp.Vector3(2652.851, 4437.596, 40.71859), new mp.Vector3(-0.01268282, -0.02595236, -0.9178895), -0.3957833);
	streamObject.add("prop_haybale_02", new mp.Vector3(2652.066, 4438.491, 40.22989), new mp.Vector3(0.005807674, 0.01722635, 0.380463), 0.9246175);
	streamObject.add("prop_fnccorgm_02d", new mp.Vector3(2645.662, 4444.597, 39.63587), new mp.Vector3(-0.01153291, 0.002158396, 0.3765718), 0.9263131);
	streamObject.add("prop_haybale_03", new mp.Vector3(2643.382, 4442.212, 40.40083), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2643.361, 4442.197, 41.50302), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2637.736, 4446.367, 40.3631), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2637.715, 4446.352, 41.45013), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_02", new mp.Vector3(2644.803, 4432.462, 40.18245), new mp.Vector3(-0.003781575, 0.00660497, 0.9197657), 0.3923941);
	streamObject.add("prop_haybale_02", new mp.Vector3(2644.786, 4432.477, 41.1908), new mp.Vector3(-0.003781575, 0.00660497, 0.9197657), 0.3923941);
	streamObject.add("prop_boxpile_04a", new mp.Vector3(2633.405, 4436.314, 40.71026), new mp.Vector3(0.004148131, -0.003215366, 0.926515), -0.3762212);
	streamObject.add("prop_boxpile_04a", new mp.Vector3(2632.345, 4435.225, 40.70595), new mp.Vector3(0.004148131, -0.003215366, 0.926515), -0.3762212);
	streamObject.add("prop_fnccorgm_03b", new mp.Vector3(2638.474, 4439.31, 42.01248), new mp.Vector3(0.007963648, -0.00476468, 0.9264901), -0.3762048);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2642.083, 4435.804, 42.01991), new mp.Vector3(0.001636779, -0.002195602, 0.9265229), -0.3762285);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2642.109, 4432.328, 41.87267), new mp.Vector3(-0.005972471, 0.00178258, -0.3940703), 0.9190593);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2644.882, 4426.008, 41.88514), new mp.Vector3(-0.003932375, 6.586592E-05, 0.9265159), -0.3762349);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2636.134, 4421.239, 42.11597), new mp.Vector3(-0.01188805, 0.02269009, 0.4086793), -0.9123185);
	streamObject.add("prop_pallet_pile_02", new mp.Vector3(2632.031, 4418.123, 42.354), new mp.Vector3(-0.01207145, 0.02259305, 0.4012762), -0.9155989);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2619.063, 4433.976, 41.27477), new mp.Vector3(-0.00513494, -0.0001706923, -0.3940821), 0.9190609);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2622.478, 4437.564, 41.30293), new mp.Vector3(-0.003749562, -0.003401545, -0.3940977), 0.9190546);
	streamObject.add("prop_fnccorgm_04a", new mp.Vector3(2638.945, 4451.019, 39.79491), new mp.Vector3(-0.01733805, -0.0422083, -0.3911082), -0.9192129);
	streamObject.add("prop_fnccorgm_04c", new mp.Vector3(2635.538, 4454.56, 39.13842), new mp.Vector3(-0.01733805, -0.0422083, -0.3911082), -0.9192129);
	streamObject.add("prop_haybale_03", new mp.Vector3(2629.43, 4448.83, 39.46063), new mp.Vector3(0.2737646, 0.6937061, 0.2588286), 0.6138669);
	streamObject.add("prop_haybale_03", new mp.Vector3(2629.438, 4448.783, 40.65504), new mp.Vector3(0.2737646, 0.6937061, 0.2588286), 0.6138669);
	streamObject.add("prop_haybale_03", new mp.Vector3(2629.329, 4448.854, 41.78106), new mp.Vector3(0.2737646, 0.6937061, 0.2588286), 0.6138669);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2666.802, 4451.954, 39.78392), new mp.Vector3(-0.005307124, -0.0003730685, -0.3840012), 0.9233174);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2649.334, 4458.036, 39.57169), new mp.Vector3(0.02108784, -0.006517297, -0.3713583), 0.9282272);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2645.874, 4461.367, 39.32327), new mp.Vector3(0.0235685, -0.005739353, -0.3842945), 0.9228919);
	streamObject.add("prop_fnccorgm_04a", new mp.Vector3(2649.618, 4461.272, 39.53754), new mp.Vector3(-0.006609924, -0.01699366, -0.3914365), -0.9200245);
	streamObject.add("prop_pallet_pile_03", new mp.Vector3(2655.596, 4434.949, 39.9093), new mp.Vector3(-0.01693211, 0.009934127, 0.9856321), -0.1677617);
	streamObject.add("prop_haybale_02", new mp.Vector3(2652.041, 4438.513, 41.16194), new mp.Vector3(0.005807674, 0.01722635, 0.380463), 0.9246175);
	streamObject.add("prop_fnccorgm_01b", new mp.Vector3(2639.88, 4437.977, 39.89056), new mp.Vector3(0.0205951, -0.008485533, -0.4026151), 0.9150984);
	streamObject.add("prop_fnccorgm_01b", new mp.Vector3(2643.874, 4442.819, 39.67894), new mp.Vector3(0.0205951, -0.008485533, -0.4026151), 0.9150984);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2663.356, 4448.488, 39.76736), new mp.Vector3(-0.005307124, -0.0003730685, -0.3840012), 0.9233174);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2662.283, 4445.978, 39.79461), new mp.Vector3(0.009282626, 0.02690897, 0.3815374), 0.923915);
	streamObject.add("prop_haybale_03", new mp.Vector3(2657.156, 4444.429, 40.26191), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_fnccorgm_01b", new mp.Vector3(2655.065, 4442.296, 39.64346), new mp.Vector3(-0.01365952, -0.00723146, 0.3874513), -0.9217606);
	streamObject.add("prop_haybale_03", new mp.Vector3(2657.136, 4444.415, 41.30704), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2643.339, 4442.182, 42.66297), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2637.695, 4446.338, 42.49319), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2629.219, 4448.925, 42.91883), new mp.Vector3(0.2737646, 0.6937061, 0.2588286), 0.6138669);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2649.275, 4464.792, 39.24409), new mp.Vector3(0.02189979, -0.0017324, -0.3843932), 0.9229081);
	streamObject.add("prop_haybale_03", new mp.Vector3(2636.162, 4460.477, 39.46524), new mp.Vector3(0.2702117, 0.6852753, 0.2625356), 0.6232643);
	streamObject.add("prop_haybale_03", new mp.Vector3(2636.08, 4460.523, 40.52848), new mp.Vector3(0.2702117, 0.6852753, 0.2625356), 0.6232643);
	streamObject.add("prop_haybale_03", new mp.Vector3(2636.066, 4460.501, 41.5889), new mp.Vector3(0.2702117, 0.6852753, 0.2625356), 0.6232643);
	streamObject.add("prop_haybale_03", new mp.Vector3(2637.431, 4459.235, 39.61713), new mp.Vector3(0.2702117, 0.6852753, 0.2625356), 0.6232643);
	streamObject.add("prop_haybale_03", new mp.Vector3(2638.807, 4457.892, 40.15499), new mp.Vector3(0.6797749, 0.2837653, -0.2640388), 0.622629);
	streamObject.add("prop_haybale_03", new mp.Vector3(2635.997, 4460.534, 42.70606), new mp.Vector3(0.2702117, 0.6852753, 0.2625356), 0.6232643);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2642.615, 4467.666, 39.40099), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.029, 4467.207, 39.43064), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.458, 4466.758, 39.49131), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.871, 4466.315, 39.53965), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.997, 4465.716, 39.58999), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2642.552, 4467.724, 40.27214), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.808, 4466.374, 40.42102), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.934, 4465.774, 40.46167), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2642.491, 4467.781, 41.12193), new mp.Vector3(0.01685397, 0.01604635, -0.3032189), 0.9526368);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2643.872, 4465.832, 41.3308), new mp.Vector3(0.04246974, 0.02419584, -0.3026777), 0.9518389);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2644.318, 4465.221, 39.49954), new mp.Vector3(-0.177178, 0.671765, -0.2490489), 0.6747699);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2637.618, 4436.838, 40.373), new mp.Vector3(-0.008259071, -0.01691119, -0.3038712), 0.9525273);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2631.018, 4429.506, 40.50091), new mp.Vector3(0.003877467, 0.004971217, 0.9743288), -0.2250416);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2630.611, 4429.063, 40.50838), new mp.Vector3(0.003877467, 0.004971217, 0.9743288), -0.2250416);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2630.168, 4428.656, 40.51598), new mp.Vector3(0.003877467, 0.004971217, 0.9743288), -0.2250416);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2625.261, 4434.437, 40.1106), new mp.Vector3(-0.08217943, 0.01575651, 0.9702713), -0.2270946);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2625.741, 4434.806, 40.1106), new mp.Vector3(-0.08217943, 0.01575651, 0.9702713), -0.2270946);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2626.184, 4435.237, 40.15327), new mp.Vector3(-0.08217943, 0.01575651, 0.9702713), -0.2270946);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2626.618, 4435.657, 40.16695), new mp.Vector3(-0.06638017, 0.0168624, 0.971264), -0.2279381);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2626.512, 4435.712, 41.03476), new mp.Vector3(-0.06638017, 0.0168624, 0.971264), -0.2279381);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2656.853, 4457.131, 39.55725), new mp.Vector3(-0.005307124, -0.0003730685, -0.3840012), 0.9233174);
	streamObject.add("prop_fnccorgm_04a", new mp.Vector3(2647.317, 4456.562, 39.70694), new mp.Vector3(-0.006609924, -0.01699366, -0.3914365), -0.9200245);
	streamObject.add("prop_haybale_03", new mp.Vector3(2647.377, 4459.442, 40.04871), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2660.271, 4467.984, 40.06335), new mp.Vector3(0.6705957, 0.2687428, -0.2569321), 0.6419227);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2661.596, 4469.248, 40.06414), new mp.Vector3(0.6705957, 0.2687428, -0.2569321), 0.6419227);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.916, 4470.507, 40.06492), new mp.Vector3(0.6705957, 0.2687428, -0.2569321), 0.6419227);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2625.106, 4424.469, 40.33784), new mp.Vector3(0.6518038, 0.3019295, -0.2540872), 0.6476343);
	streamObject.add("prop_barrel_01a", new mp.Vector3(2625.474, 4424.911, 41.18176), new mp.Vector3(-0.03567298, -0.001445879, 0.9730117), -0.2279775);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2656.466, 4448.837, 39.99552), new mp.Vector3(0.6523055, 0.2774187, -0.2694856), 0.6518543);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2646.388, 4440.41, 40.01169), new mp.Vector3(0.6525112, 0.2728581, -0.2821398), 0.6482089);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2631.199, 4449.788, 39.30931), new mp.Vector3(0.6580116, 0.2881498, -0.2676561), 0.6421453);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2656.225, 4458.884, 39.88191), new mp.Vector3(0.708968, -0.01484126, 0.04059347), 0.7039151);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2666.446, 4447.127, 40.35856), new mp.Vector3(0.6663077, -0.2684094, 0.2981232), 0.6285802);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2636.458, 4427.499, 40.33391), new mp.Vector3(-0.2495649, -0.6542226, 0.6495683), -0.2962623);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2641.549, 4421.939, 40.33784), new mp.Vector3(0.6598644, 0.2838812, -0.2718103), 0.640398);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2619.17, 4441.781, 39.12092), new mp.Vector3(0.6613539, -0.2776737, 0.2914167), 0.6329176);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2656.466, 4448.837, 40.87645), new mp.Vector3(0.6523055, 0.2774187, -0.2694856), 0.6518543);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2666.431, 4447.184, 41.22239), new mp.Vector3(0.6663077, -0.2684094, 0.2981232), 0.6285802);
	streamObject.add("prop_haybale_03", new mp.Vector3(2671.086, 4449.906, 40.57435), new mp.Vector3(0.2669835, 0.6776084, 0.2658179), 0.6315913);
	streamObject.add("prop_haybale_03", new mp.Vector3(2671.023, 4449.934, 41.64014), new mp.Vector3(0.2669835, 0.6776084, 0.2658179), 0.6315913);
	streamObject.add("prop_haybale_03", new mp.Vector3(2670.958, 4449.962, 42.71801), new mp.Vector3(0.2669835, 0.6776084, 0.2658179), 0.6315913);
	streamObject.add("prop_flagpole_2a", new mp.Vector3(2645.294, 4445.017, 39.52153), new mp.Vector3(0.0205951, -0.008485533, -0.4026151), 0.9150984);
	streamObject.add("prop_flag_us", new mp.Vector3(2645.284, 4445.442, 49.05764), new mp.Vector3(0.0205951, -0.008485533, -0.4026151), 0.9150984);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2648.204, 4474.131, 38.93438), new mp.Vector3(0, 0, -0.3865369), 0.9222739);
	streamObject.add("prop_fnclink_10c", new mp.Vector3(2672.405, 4449.813, 40.02512), new mp.Vector3(0, 0, -0.3808657), 0.9246305);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.868, 4470.556, 41.60846), new mp.Vector3(0.6705957, 0.2687428, -0.2569321), 0.6419227);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2661.548, 4469.296, 41.60841), new mp.Vector3(0.6705957, 0.2687428, -0.2569321), 0.6419227);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.024, 4469.337, 40.07447), new mp.Vector3(0.2506528, -0.6444066, 0.6729679), 0.262731);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2661.977, 4469.385, 41.61339), new mp.Vector3(0.2506528, -0.6444066, 0.6729679), 0.262731);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2657.851, 4473.428, 38.99332), new mp.Vector3(0.02189979, -0.0017324, -0.3843932), 0.9229081);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2653.802, 4471.017, 39.03883), new mp.Vector3(0.02162101, 0.003890228, -0.1372185), 0.9902972);
	streamObject.add("prop_fnccorgm_02a", new mp.Vector3(2657.822, 4473.516, 41.09864), new mp.Vector3(0.02189979, -0.0017324, -0.3843932), 0.9229081);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2656.194, 4458.891, 40.74954), new mp.Vector3(0.708968, -0.01484126, 0.04059347), 0.7039151);
	streamObject.add("prop_dumpster_02b", new mp.Vector3(2651.864, 4476.171, 38.5871), new mp.Vector3(0.01925691, 0.02147787, 0.4099181), 0.9116662);
	streamObject.add("prop_dumpster_02b", new mp.Vector3(2653.122, 4474.755, 38.70721), new mp.Vector3(0.01624761, 0.01478571, 0.4100484), 0.9117991);
	streamObject.add("prop_dumpster_02b", new mp.Vector3(2667.495, 4454.051, 39.63028), new mp.Vector3(-0.01212194, -0.004116452, 0.9107855), -0.4126816);
	streamObject.add("prop_haybale_03", new mp.Vector3(2669.622, 4463.529, 40.0878), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2668.337, 4462.21, 40.04546), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2667.06, 4460.899, 40.00334), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2669.606, 4463.52, 41.23153), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2667.013, 4460.858, 41.14606), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2666.99, 4460.841, 42.35535), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_haybale_03", new mp.Vector3(2669.585, 4463.505, 42.39501), new mp.Vector3(0.2593265, 0.6593975, 0.2732931), 0.650581);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2660.1, 4466.688, 40.16183), new mp.Vector3(0.3054164, 0.6386558, -0.6591507), 0.2536927);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2661.34, 4465.377, 40.19532), new mp.Vector3(0.3054164, 0.6386558, -0.6591507), 0.2536927);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2661.254, 4465.462, 41.72496), new mp.Vector3(0.3054164, 0.6386558, -0.6591507), 0.2536927);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.576, 4464.069, 40.24636), new mp.Vector3(0.2973518, 0.6424502, -0.6559046), 0.261971);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.515, 4464.128, 41.81314), new mp.Vector3(0.2973518, 0.6424502, -0.6559046), 0.261971);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.123, 4464.898, 40.26517), new mp.Vector3(-0.6536704, 0.2676695, -0.2902335), -0.6456258);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2662.086, 4464.933, 41.7654), new mp.Vector3(-0.6536704, 0.2676695, -0.2902335), -0.6456258);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2667.638, 4459.188, 40.3047), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2667.61, 4459.212, 41.82921), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2668.867, 4457.859, 40.34824), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2670.127, 4456.554, 40.39199), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2671.36, 4455.25, 40.43521), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2673.846, 4452.619, 40.52242), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2673.819, 4452.643, 42.03743), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2671.332, 4455.274, 41.96645), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2670.083, 4456.595, 41.92269), new mp.Vector3(0.2878747, 0.6467523, -0.6519824), 0.2715855);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2659.381, 4458.308, 40.21673), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2660.677, 4457.049, 40.22565), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2660.673, 4457.053, 41.73296), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2651.63, 4465.834, 39.96263), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2652.935, 4464.567, 39.96872), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2654.247, 4463.294, 39.97483), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2654.243, 4463.297, 41.53281), new mp.Vector3(-0.655681, 0.2647014, -0.2669019), -0.6548123);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2652.354, 4444.819, 40.08155), new mp.Vector3(-0.6537623, -0.2694051, -0.648744), -0.2813309);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2651.249, 4445.892, 39.57583), new mp.Vector3(-0.6537623, -0.2694051, -0.648744), -0.2813309);
	streamObject.add("prop_barrel_pile_01", new mp.Vector3(2619.168, 4441.817, 39.93351), new mp.Vector3(0.6613539, -0.2776737, 0.2914167), 0.6329176);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2620.13, 4439.235, 39.43119), new mp.Vector3(-0.03216345, -0.004855996, 0.5740009), -0.8182083);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2625.229, 4427.106, 40.70773), new mp.Vector3(-0.0291595, 0.014415, 0.9388492), -0.3427889);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2629.608, 4432.308, 40.72048), new mp.Vector3(-0.0291595, 0.014415, 0.9388492), -0.3427889);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2638.709, 4426.954, 40.31019), new mp.Vector3(-0.01179281, 0.008721877, 0.9064969), -0.4219579);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2628.824, 4445.831, 39.62403), new mp.Vector3(-0.06387409, 0.02708728, 0.9371276), -0.3420209);
	streamObject.add("prop_veg_crop_06", new mp.Vector3(2626.279, 4442.818, 39.68305), new mp.Vector3(-0.06387409, 0.02708728, 0.9371276), -0.3420209);
	streamObject.add("prop_haybale_02", new mp.Vector3(2629.565, 4424.673, 40.51968), new mp.Vector3(0.01063203, 0.01524095, 0.3805476), 0.9245746);
	streamObject.add("prop_haybale_02", new mp.Vector3(2629.57, 4424.678, 41.43234), new mp.Vector3(-0.005454286, -0.02383274, 0.380657), 0.9243931);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2670.828, 4456.125, 40.4116), new mp.Vector3(-0.6523464, 0.2707663, -0.287049), -0.6470956);
	streamObject.add("prop_pallet_03b", new mp.Vector3(2670.8, 4456.149, 41.9218), new mp.Vector3(-0.6523464, 0.2707663, -0.287049), -0.6470956);
});


ObjectStreamer.isLoaded = true;