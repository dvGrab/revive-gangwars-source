let chat =
{
	size: 0,
	container: null,
	input: null,
	enabled: false,
	active: true,
	fadeTimer: null
};

function fadeOut() {
	if (chat.fadeTimer != null)
		clearTimeout(chat.fadeTimer);

	chat.fadeTimer = setTimeout(() => {
		$("#chat_messages").fadeOut(1000);
		chat.fadeTimer = null;
	}, 10 * 1000);
}

function enableChatInput(enable) {
	if (chat.active == false
		&& enable == true)
		return;

	if (enable != (chat.input != null)) {
		//chat_printing = enable;

		mp.invoke("focus", enable);

		if (enable) {
			$("#chat_messages").fadeIn(1000);
			$("#chat_messages").css("overflow-y", "scroll");

			chat.input = $("#chat").append('<div><input id="chat_msg" type="text" /></div>').children(":last");
			chat.input.children("input").focus();
		}
		else {
			chat.input.fadeOut('fast', function () {
				chat.input.remove();
				chat.input = null;
				$("#chat_messages").css("overflow-y", "hidden");

				fadeOut();
			});
		}
	}
}

var chatAPI =
{
	push: (text) => {
		var htmlstrip = text.replace(/<(?!(font|\/font))([^>])+>/gi, " ");

		if (text.includes("p_1")) {
			htmlstrip = htmlstrip.replace("p_1", " ");
			htmlstrip = "<img width='15px' src='prestige_1.png'/>" + htmlstrip;
		}

		if (text.includes("b_1")) {
			htmlstrip = htmlstrip.replace("b_1", " ");
			htmlstrip = "<img width='13px' src='./ranks/bronce.png'/>" + htmlstrip;
		}

		if (text.includes("s_1")) {
			htmlstrip = htmlstrip.replace("s_1", " ");
			htmlstrip = "<img width='13px' src='./ranks/silver.png'/>" + htmlstrip;
		}

		if (text.includes("g_1")) {
			htmlstrip = htmlstrip.replace("g_1", " ");
			htmlstrip = "<img width='13px' src='./ranks/gold.png'/>" + htmlstrip;
		}

		if (text.includes("d_1")) {
			htmlstrip = htmlstrip.replace("d_1", " ");
			htmlstrip = "<img width='13px' src='./ranks/diamond.png'/>" + htmlstrip;
		}

		chat.container.prepend("<li>" + htmlstrip + "</li>");

		chat.size++;

		if (chat.size >= 50) {
			chat.container.children(":last").remove();
		}

		$("#chat_messages").fadeIn(1000);
		fadeOut();
	},

	clear: () => {
		chat.container.html("");
	},

	activate: (toggle) => {
		if (toggle == false
			&& (chat.input != null))
			enableChatInput(false);

		chat.active = toggle;
	},

	show: (toggle) => {
		if (toggle)
			$("#chat").show();
		else
			$("#chat").hide();

		chat.active = toggle;
	}
};

$(document).ready(function () {
	chat.container = $("#chat ul#chat_messages");

	$(".ui_element").show();
	chatAPI.push("Multiplayer started");

	$("body").keydown(function (event) {
		if (event.which == 84 && chat.input == null
			&& chat.active == true) {
			enableChatInput(true);
			event.preventDefault();
		}
		else if (event.which == 13 && chat.input != null) {
			var value = chat.input.children("input").val();

			if (value.length > 0) {
				if (value[0] == "/") {
					value = value.substr(1);

					if (value.length > 0)
						mp.invoke("command", value);
				}
				else {
					mp.invoke("chatMessage", value);
				}
			}

			enableChatInput(false);
		}
	});
});