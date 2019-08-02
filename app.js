var express = require('express');
var router = require('./routes/routes');
var path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const bodyParser = require('body-parser')
const http = require('http')

//app config//
var app = express();
app.server = http.createServer(app);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())
app.use('/', router);


//db connection//
mongoose.connect(keys.MONGO_URI, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => {
    console.log(error)
})
db.once('open', () => {
    console.log("Connected to the Databse")
})

app.listen(process.env.PORT || 3000, process.env.IP , () => {
    console.log(`Server runnning`)
})


module.exports=app;