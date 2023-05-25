import axios from 'axios'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function chatMidGen2(ctx, msgId) {
    var dataa;
    let ur = `https://api.thenextleg.io/v2/message/${msgId}?expireMins=2`;
    console.log(ur)
    ur = 'https://api.thenextleg.io/v2/message/qzFGL8J3MB4P7yDJhW5I?expireMins=2';

    var configg = {
        method: 'get',
        url: ur,
        headers: {
            'Authorization': 'Bearer dc7f6124-4013-44a8-92dc-bf09ce319049',
            'Content-Type': 'application/json'
        },
        data : dataa
    };

    let img;
    await axios(configg)
        .then(function (response) {
            let pr = response.data.progress
            console.log(response.data.progress)
            img = response.data.response.imageUrl;
            ctx.reply("Finished!")
        })
        .catch(function (error) {
            console.log("errorAxios");
        });

    return img;
}