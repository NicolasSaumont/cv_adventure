const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const router = require('./app/router');
const session = require("express-session");

const PORT = process.env.PORT;

const app = express();

app.use(session({
  secret:'princess consuela banana hammock',
  resave:true,
  saveUninitialized:true,
  cookie:{
    secure: false,
    maxAge: (1000*60*60) // ça fait une heure
  }
}));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');

app.use(express.static(path.join(__dirname, './public')))

app.use(express.urlencoded({ extended: true }));

app.use((req,res,next)=>{
  res.locals.gameStarted = req.session.gameStarted;
  next();
})

app.use(router);

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});