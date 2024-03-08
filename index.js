const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://www.imdb.com/chart/top/";

const moviesData = {};

async function getHTML() {
    try {
        const { data: html } = await axios.get(url);
        return html;
    } catch (error) {
        throw new Error(`Error fetching HTML: ${error.message}`);
    }
}

getHTML().then((res) => {
    const $ = cheerio.load(res);
    $('.lister-list>tr').each((i, movie) => {
        const title = $(movie).find('.titleColumn a').text();
        const rating = $(movie).find('.imdbRating strong').text();
        moviesData[title] = rating;
    });

    fs.writeFile('moviesData.json', JSON.stringify(moviesData), (err) => {
        if (err) throw new Error(`Error writing file: ${err.message}`);
        console.log('File saved');
    });
});
