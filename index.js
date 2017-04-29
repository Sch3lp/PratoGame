var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express()
var path = require('path');

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pratogame.db');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    db.run('INSERT INTO Player (Cookie) VALUES (?)', getCookieNumber(req, res), () => {
        db.run('INSERT INTO Session (StartDate, PlayerId) VALUES (?,?)', [now, this.lastID])
    })
});

app.post('/input', function (req, res) {
    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    db.run('UPDATE Session \
    SET LastInput = ?, InputData = IFNULL(InputData, \'\') || ? \
    WHERE Cookie = ? AND id = (SELECT MAX([id]) FROM Session)', [now, req.body.input, req.cookies.pratoGameCookie])
})

app.post('/playerinfo', function (req, res) {
    db.run('UPDATE Session \
    SET Email = ? \
    WHERE Cookie = ? AND id = (SELECT MAX([id]) FROM Session)', [req.body.playerinfo, req.cookies.pratoGameCookie])
})

app.listen(8080)

getCookieNumber = (request, response) => {
    var cookie = request.cookies.pratoGameCookie;
    var randomNumber;
    if (cookie === undefined) {
        randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);
        response.cookie('pratoGameCookie', randomNumber, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        console.log('cookie created successfully');
    }
    else {
        console.log('cookie exists', cookie);
    }
    return cookie ? cookie : randomNumber;
}