var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

var db = new sqlite3.Database('pratogame.db');

app.use(express.static('public'))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    const cookie = getCookieNumber(req, res)
    db.run('INSERT INTO Player (Cookie) VALUES (?)', getCookieNumber(req, res), () => {
        db.run('INSERT INTO Session (StartDate, PlayerId) VALUES (?,(SELECT [id] FROM Player WHERE Cookie = ?))', [this.getLocalNow(), cookie])
    })
});

app.post('/input', function (req, res) {
    db.run('UPDATE Session \
    SET LastInput = ?, InputData = (IFNULL(InputData, \'\') || ?) \
    WHERE PlayerId = (SELECT Id FROM Player WHERE Cookie = ?) AND Session.id = (SELECT MAX(Id) FROM Session)', [this.getLocalNow(), req.body.input, req.cookies.pratoGameCookie])
})

app.post('/playerinfo', function (req, res) {
    db.run('UPDATE Session \
    SET FreeComment = ? \
    WHERE PlayerId = (SELECT Id FROM Player WHERE Cookie = ?) AND Session.id = (SELECT MAX(Id) FROM Session)', [req.body.freeComment, req.cookies.pratoGameCookie])
    db.run('UPDATE Player \
    SET Email = ?, FirstName = ?, LastName = ? \
    WHERE Cookie = ?', [req.body.emailAddress, req.body.firstName, req.body.lastName, req.cookies.pratoGameCookie])
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

getLocalNow = () => {
    const nowUTC = new Date()
    nowUTC.setMinutes(nowUTC.getMinutes() - nowUTC.getTimezoneOffset());
    const now = nowUTC.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    return now
}