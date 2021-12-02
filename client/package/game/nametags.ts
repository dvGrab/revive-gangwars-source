var adminTags = false;

mp.events.add("toogleAdminTags", (status: boolean) => {
    adminTags = status;
});

mp.events.add(RageEnums.EventKey.RENDER, (nametags) => {

    if (nametags) {
        nametags.forEach((nametag: any) => {
            var [player] = nametag;

            if (player) {

                if (player.dimension != mp.players.local.dimension)
                    return false;

                var distance = mp.game.system.vdist(player.position.x, player.position.y, player.position.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
                var fontScale = 0.3 / distance;

                const canSee = mp.raycasting.testPointToPoint(mp.players.local.position, player.position);

                if (!canSee)
                    return false;

                var head = mp.game.graphics.world3dToScreen2d(player.position.x, player.position.y, player.position.z + 1.25);

                if (player.getVariable("onduty") == true) {
                    if (player) {
                        if (player.getHealth() >= 1) {

                            if (head) {
                                mp.game.graphics.drawText("Teammitglied im Dienst", [head.x, head.y - 0.06], {
                                    font: 0,
                                    centre: true,
                                    scale: [0.2 + fontScale, 0.2 + fontScale],
                                    outline: true,
                                    color: [255, 0, 0, 255]
                                });
                            }
                        }
                    }
                }

          

                if (player.getVariable("team") == mp.players.local.getVariable("team") || (adminTags == true)) {
                    if (player.getHealth() >= 1) {

                        if (distance <= 25 || adminTags) {

                            if (player) {
                                if (head) {
                                    var tagColor = [0, 200, 255, 255];

                                    if (player.getVariable("donator") >= 1)
                                        tagColor = [0, 230, 100, 255];

                                    if (player.getVariable("onduty"))
                                        if (player.getVariable("reported") >= 1)
                                            tagColor = [255, 0, 0, 255];

                                    if (player.getVariable("group") > 0) {
                                        if (player.getVariable("group") == mp.players.local.getVariable("group"))
                                            tagColor = [255, 153, 0, 255];

                                        if (player.getVariable("groupLeader"))
                                            tagColor = [255, 109, 109, 255];

                                        mp.game.graphics.drawText(player.getVariable("groupName"), [head.x, head.y - 0.03], {
                                            font: 0,
                                            centre: true,
                                            scale: [0.2 + fontScale, 0.2 + fontScale],
                                            outline: true,
                                            color: [84, 255, 178, 255]
                                        });

                                    }

                                    if(player.getVariable("level") < 2)
                                        tagColor = [255, 29, 236, 255];

                                    mp.game.graphics.drawText(player.name, [head.x, head.y], {
                                        font: 0,
                                        centre: true,
                                        scale: [0.2 + fontScale, 0.2 + fontScale],
                                        outline: true,
                                        color: [tagColor[0], tagColor[1], tagColor[2], tagColor[3]]
                                    });
                                }

                            }
                        }
                    }
                }
            }
        })
    }
})