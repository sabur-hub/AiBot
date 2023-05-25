import axios from 'axios'
 export async function chatMidGen(ctx, tmp) {
    var data = JSON.stringify({
        "msg": tmp,
        "ref": "",
        "webhookOverride": ""
    });

    var config = {
        method: 'post',
        url: 'https://api.thenextleg.io/v2/imagine',
        headers: {
            'Authorization': 'Bearer dc7f6124-4013-44a8-92dc-bf09ce319049',
            'Content-Type': 'application/json'
        },
        data: data
    };

    let msgId = "";
    await axios(config)
        .then(function (response) {
            msgId = response.data.messageId;
        })
        .catch(function (error) {
            console.log(error);
        });
    return msgId;
}
