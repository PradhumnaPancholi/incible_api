 const express = require('express')
const userRoutes = require('./userRoutes')
const incidentRoutes = require('./incidentRoutes')

const router = express.Router()

router.get('/', function(req, res){
    res.render('index')
});

router.get('/status', (req,response) => {
    response.send({status: 'Running'})
});


router.use('/user/', userRoutes)
router.use('/incident/', incidentRoutes)

module.exports = router