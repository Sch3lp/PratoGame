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
});

app.post('/newSession', function (req, res) {
    var me = this;
    const cookie = getCookieNumber(req, res)
    const recruitmentId = req.body.recId ? req.body.recId : null
    var playerId;
    db.all('SELECT [id] FROM Player WHERE Cookie = ?', cookie, function (err, rows) {
        if(rows[0]) playerId = rows[0].Id
        if (!playerId) {
            db.run('INSERT INTO Player (Cookie, RecruitmentIdentifier) VALUES (?, ?)', [cookie, recruitmentId], function (err, row) {
                playerId = this.lastID
                db.run('INSERT INTO Session (StartDate, PlayerId, Level) VALUES (?, ?, ?)', [me.getLocalNow(), playerId, req.body.level])
            })
        } else {
            db.run('INSERT INTO Session (StartDate, PlayerId, Level) VALUES (?, ?, ?)', [me.getLocalNow(), playerId, req.body.level])
        }
    })
    res.end()
});

app.post('/input', function (req, res) {
    const input = req.body.input

    db.run('UPDATE Session \
    SET LastInput = ?, InputData = (IFNULL(InputData, \'\') || ?) \
    WHERE PlayerId = (SELECT Id FROM Player WHERE Cookie = ?) AND Session.id = (SELECT MAX(Id) FROM Session)', [this.getLocalNow(), input, req.cookies.pratoGameCookie])
    res.end()
})

app.post('/playerinfo', function (req, res) {
    const ToBool = (property) => property === "on" ? '1' : '0'
    db.run('UPDATE Session \
    SET FreeComment = ? \
    WHERE PlayerId = (SELECT Id FROM Player WHERE Cookie = ?) AND Session.id = (SELECT MAX(Id) FROM Session)', [req.body.freeComment, req.cookies.pratoGameCookie])
    db.run('UPDATE Player \
    SET Email = ?, infoAboutPrato = ?, infoAboutDevStuff = ?, infoAboutVacancies = ? \
    WHERE Cookie = ?', [req.body.emailAddress, ToBool(req.body.infoAboutPrato), ToBool(req.body.infoAboutDevStuff),
                        ToBool(req.body.infoAboutVacancies), req.cookies.pratoGameCookie])
    res.end()
})

app.listen(8888)

getCookieNumber = (request, response) => {
    var cookie = request.cookies.pratoGameCookie;
    var randomNumber;
    if (cookie === undefined) {
        randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);
        response.cookie('pratoGameCookie', randomNumber, { maxAge: 365 * 24 * 60 * 60 * 1000 });
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