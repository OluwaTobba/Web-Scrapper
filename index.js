const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://www.imdb.com/chart/top/?ref_=nv_mv_250";

const moviesData = {};

// async function getHTML () {
//     const { data: html } = await axios.get(url);
//     return html;
// };

// async function getHTML() {
//     try {
//         const { data: html } = await axios.get(url);
//         return html;
//     } catch (error) {
//         throw new Error(`Error fetching HTML: ${error.message}`);
//     }
// }


async function getHTML() {
    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });
        return html;
    } catch (error) {
        throw new Error(`Error fetching HTML: ${error.message}`);
    }
}

getHTML().then((res) => {
    const $ = cheerio.load(res);
    $('.lister-list>tr').each((i, movie) => {
        const title = $(movie).find('.ipc-title--base').text();
        const rating = $(movie).find('.ipc-rating-star--imdb').text();
        moviesData[title] = rating;
    });

    fs.writeFile('moviesData.json', JSON.stringify(moviesData), (err) => {
        if (err) throw new Error(`Error writing file: ${err.message}`);
        console.log('File saved');
    });
});
