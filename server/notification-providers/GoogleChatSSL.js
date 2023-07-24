const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { setting } = require("../util-server");
const { getMonitorRelativeURL } = require("../../src/util");
const { DOWN, UP } = require("../../src/util");

class GoogleChatSSL extends NotificationProvider {

    name = "GoogleChatSSL";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";
        try {
            // Google Chat message formatting: https://developers.google.com/chat/api/guides/message-formats/basic

            let textMsg = "";
            if (heartbeatJSON && heartbeatJSON.status === UP) {
                textMsg = "Monitor is Online:  ";
            } else if (heartbeatJSON && heartbeatJSON.status === DOWN) {
                textMsg = "Issue with Monitor:  ";
            }

            //if (monitorJSON && monitorJSON.name) {
            //    textMsg += `*${monitorJSON.name}*\n`;
            //}

            textMsg += `${msg}`;

           // const baseURL = await setting("primaryBaseURL");
           // if (baseURL && monitorJSON) {
           //     textMsg += `\n${baseURL + getMonitorRelativeURL(monitorJSON.id)}`;
           // }
	    if (monitorJSON.url != "null"){
		textMsg += `\n${monitorJSON.url}`
	    }

            const data = {
                "text": textMsg,
            };

            await axios.post(notification.googleChatWebhookURL, data);
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }

    }
}

module.exports = GoogleChatSSL;
