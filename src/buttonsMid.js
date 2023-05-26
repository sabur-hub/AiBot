import axios from "axios";
import {chatMidGen2} from './apiMedGiveImg.js'

export async function buttons(ctx, button, btnMesId) {
    var data = JSON.stringify({
        "button": button,
        "buttonMessageId": btnMesId,
        "ref": "",
        "webhookOverride": ""
    });

    var config = {
        method: 'post',
        url: 'https://api.thenextleg.io/v2/button',
        headers: {
            'Authorization': 'Bearer dc7f6124-4013-44a8-92dc-bf09ce319049',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let msId;
    await axios(config)
        .then(function (response) {
            msId = response.data.messageId
        })
        .catch(function (error) {
            console.log(error);
        });

    let msg = await chatMidGen2(ctx, msId);
    return msg
}

