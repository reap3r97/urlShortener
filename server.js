const express = require('express')
const mongoose = require('mongoose')
const app = express()
const shortUrl = require('./model/shortUrl')
const config = require('./config/database')

mongoose.connect(config.database, {
    useNewUrlParser: true, useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('DB is live > ' + config.database);

});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res, next) => {
    const shortUrls = await shortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortenUrl', async (req, res) => {
    await shortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const sUrl = await shortUrl.findOne({ short: req.params.shortUrl })
    if (sUrl == null) return res.status(404)
    else {
        sUrl.clicks++
        sUrl.save()

        return res.redirect(sUrl.full)
    }

})

app.listen(process.env.PORT || 5000);