import axios from 'axios'

export async function chatMidGen2(ctx, msgId) {
    var data;
    let ur = `https://api.thenextleg.io/v2/message/${msgId}?expireMins=2`;
    console.log(ur)
    //ur = 'https://api.thenextleg.io/v2/message/qzFGL8J3MB4P7yDJhW5I?expireMins=2';

    var config = {
        method: 'get',
        url: ur,
        headers: {
            'Authorization': 'Bearer dc7f6124-4013-44a8-92dc-bf09ce319049',
            'Content-Type': 'application/json'
        },
        data : data
    };

    let img;
    let bl = true;
    let last = 0;
    let neww;
    while(bl){
        await axios(config)
            .then(function (response) {
                neww = response.data.progress;
                if(last != neww){
                    console.log(neww)
                }
                last = neww;
                if(last == 100){
                    img = response.data.response.imageUrl;
                    ctx.reply("Finished!");
                    bl = false
                }
            })
            .catch(function (error) {
                console.log("errorAxios");
            });
    }

    return img;
}