const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://www2.bing.com';
request.get(`${URL}`, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        console.log(body);
        let $ = cheerio.load(body);

    }
})