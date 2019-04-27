const fs = require('fs');
const express = require('express');
const app = express();
const EOL = require('os').EOL;
const moment = require('moment');

app.use(express.static('./app'));

app.get('/addData', function (req, res) {
    let timestamp = req.query.timestamp;
    let distance = req.query.distance;
    let volume = req.query.volume;

    timestamp = moment(timestamp, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    fs.appendFileSync('./data.csv', `${timestamp};${distance};${volume}${EOL}`);

    res.send(`Added measurement (${timestamp};${distance};${volume})`);
});

app.get('/getData', function (req, res) {
    let csvData = fs.readFileSync('./data.csv', 'utf8');
    let jsonData = convertCsvToJson(csvData);

    res.send(jsonData);
});

app.get('/downloadData', function (req, res) {
    let csvData = fs.readFileSync('./data.csv', 'utf8');

    res.send(csvData);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});

function convertCsvToJson (csvData) {
    let jsonData = {
        data: []
    };

    let lines = csvData.split(EOL);
    for (let line of lines) {
        let columns = line.split(';');

        if (columns.length < 3) {
            continue;
        }
        
        jsonData.data.push({
            timestamp: columns[0],
            distance: columns[1],
            volume: columns[2]
        });
    }

    return JSON.stringify(jsonData);
}