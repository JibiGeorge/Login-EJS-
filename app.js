const express = require('express')
const app = express()
const port = 3000
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
app.use(express.urlencoded({extended:true}));

app.use(expressLayout)
app.set('layout', './layout/index')
app.set('view engine', 'ejs')

app.use(function (req, res, next) {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
});

app.use(express.static(path.join(__dirname, 'public')))
//Session
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    resave: false
}));
app.use(express.json());
app.use(cookieParser());

//username and password
const credential =
{
    myusername: "JibiGeorge",
    mypassword: "123"
}

app.get('', (req, res) => {
    const us = credential.myusername;
    if (req.session.user) {
        res.render('pages/home', {us});
    } else
        res.render('pages/login')
})

app.post('/login', (req, res) => {
    if (req.body.username === credential.myusername && req.body.password === credential.mypassword) {
        req.session.user = req.body.username;
        const us = credential.myusername;
        session=req.session;
        req.session.loggedIn=true
        res.render('pages/home', { us })
    }
    else {
        res.render('pages/login', { errMsg: "Invalid Username" });
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send("Error")
        } else {
            res.render('pages/login')
        }
    });
});

app.listen(port, () => {
    console.log("Server Start");
})