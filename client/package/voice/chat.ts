var globalVoiceVolume: number = 4;
var globalVoiceDistance: number = 15;

interface voicePlayer extends PlayerMp {
	existingVoice: any;
	isVoiceEnabled: boolean;
}- 

mp.keys.bind(0x71, true, function () {
	mp.voiceChat.muted = !mp.voiceChat.muted;
	mp.events.call("setVoiceStatus", mp.voiceChat.muted);
});

setInterval(() => {

	mp.players.forEach((element: voicePlayer) => {
		if (element.isVoiceEnabled)
			mp.events.callRemote("disableVoiceToPlayer", element);
	});

	mp.players.forEachInStreamRange((entity: voicePlayer) => {

		if (entity == mp.players.local) return false;

		var Distance = mp.game.system.vdist(entity.position.x, entity.position.y, entity.position.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
		var voiceDistance = (Distance / globalVoiceDistance) * globalVoiceVolume;

		if (Distance <= globalVoiceDistance) {

			mp.events.callRemote("enableVoiceToPlayer", entity);

			entity.isVoiceEnabled = true;
			entity.voice3d = true;
			entity.voiceVolume = globalVoiceVolume - voiceDistance;

		}

	});

}, 350);

var before = undefined;

setInterval(() => {

	before = mp.voiceChat.muted;
	mp.voiceChat.muted = false;
	mp.voiceChat.cleanupAndReload(true, true, false);
	mp.voiceChat.muted = before;
}, 1000 * 300);