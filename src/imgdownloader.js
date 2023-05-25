import fs, {createWriteStream} from "fs";
import axios from "axios";

export function kerDown(fileUrl) {
    const fileName = 'file.png';

    axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    })
        .then((response) => {
            const file = fs.createWriteStream(fileName);
            response.data.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('Файл успешно скачан.');
            });
        })
        .catch((error) => {
            console.error(`Ошибка загрузки файла: ${error}`);
        });
}
