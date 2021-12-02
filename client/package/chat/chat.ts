
interface GuiChatMp
{
    enabled : boolean;
}

mp.gui.chat.enabled = false;

mp.keys.bind(0x54, true, () => {
    
    mp.gui.chat.enabled = true;

    
});

mp.keys.bind(0x0D, true, () => {

    mp.gui.chat.enabled = false;

}); 