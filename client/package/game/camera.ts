class helperCamera {
    name: string;
    cam: CameraMp;

    constructor(name: string, cam: CameraMp) {
        this.name = name;
        this.cam = cam;
    }
}

class helperGarbage {
    oldCamera: CameraMp;
    currentCamera: CameraMp;

    constructor(oldCamera: CameraMp, currentCamera: CameraMp) {
        this.oldCamera = oldCamera;
        this.currentCamera = currentCamera;
    }
}

class Camera {

    list: helperCamera[] = [];
    garbage: helperGarbage[] = [];

    constructor() {
        this.collectInterpolationGarbage();
    }

    createCamera(name: string, position: Vector3Mp) {
        var camera = this.list.find(element => element.name == name);

        if (camera) {
            if (mp.cameras.exists(camera.cam))
                camera.cam.destroy();

            camera.cam = mp.cameras.new(name, position, new mp.Vector3(0, 0, 0), 50);
            camera.name = name;
        }
        else {
            this.list.push(new helperCamera(name, mp.cameras.new(name, position, new mp.Vector3(0, 0, 0), 50)));
        }
    }

    setCameraActive(name: string) {

        var camera = this.list.find(element => element.name == name);

        if (camera) {
            if (!mp.cameras.exists(camera.cam))
                return false;

            camera.cam.setActive(true);

            mp.game.cam.renderScriptCams(true, false, 0, false, false);
        }

    }

    setCameraEntity(name: string, entity: PlayerMp) {

        if (entity == undefined)
            return false;

        if (!mp.players.exists(entity))
            return false;

        var camera = this.list.find(element => element.name == name);

        if (camera) {
            if (mp.cameras.exists(camera.cam))
                camera.cam.pointAt(entity.handle, 0.0, 0.0, 0.0, true);
        }
    }

    setCameraPosition(name: string, position: Vector3Mp) {
        var camera = this.list.find(element => element.name == name);

        if (camera)
            if (mp.cameras.exists(camera.cam))
                camera.cam.setCoord(position.x, position.y, position.z);
    }

    setCameraLookAt(name: string, position: Vector3Mp) {
        var camera = this.list.find(element => element.name == name);

        if (camera)
            if(mp.cameras.exists(camera.cam))
                camera.cam.pointAtCoord(position.x, position.y, position.z);
    }

    setCameraInterpolate(name: string, position: Vector3Mp, pointAt: Vector3Mp, duration: number) {
        var camera = this.list.find(element => element.name == name);

        if (camera) {
            var tempCamera = mp.cameras.new("InterpolateCamera", position, new mp.Vector3(0, 0, 0), camera.cam.getFov());
            tempCamera.pointAtCoord(pointAt.x, pointAt.y, pointAt.z);

            tempCamera.setActiveWithInterp(camera.cam.handle, duration, 0, 0);
            mp.game.cam.renderScriptCams(true, false, 0, false, false);

            this.addInterpolationGargabe(camera.cam, tempCamera);
            camera.cam = tempCamera;
        }
    }

    destroyCamera(name: string) {
        var camera = this.list.find(element => element.name == name);

        if (camera) {
            this.deleteAllInterpolations();

            if (!mp.cameras.exists(camera.cam))
                return false;

            camera.cam.setActive(false);
            camera.cam.destroy();
            mp.game.cam.renderScriptCams(false, false, 0, false, false);
        }
    }

    private collectInterpolationGarbage() {
        mp.events.add(RageEnums.EventKey.RENDER, () => {

            this.garbage.forEach((element: helperGarbage) => {

                if (!mp.cameras.exists(element.oldCamera))
                    return false;

                if (element.oldCamera.isInterpolating())
                    return false;

                if (mp.cameras.exists(element.oldCamera))
                    element.oldCamera.destroy();

                var index = this.garbage.findIndex(element => element.currentCamera == element.currentCamera);
                this.garbage.splice(index, 1);
            });

        });
    }

    private addInterpolationGargabe(oldCamera: CameraMp, currentCamera: CameraMp) {
        this.garbage.push(new helperGarbage(oldCamera, currentCamera));
    }

    private deleteAllInterpolations() {
        this.garbage.forEach((element: helperGarbage) => {

            if (!mp.cameras.exists(element.oldCamera))
                return false;

            element.oldCamera.destroy();

            var index = this.garbage.findIndex(element => element.currentCamera == element.currentCamera);
            this.garbage.splice(index, 1);
        });
    }
}

var CameraEditor = new Camera();