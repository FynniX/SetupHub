const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({ dest: 'src/tmp/'})
const cors = require('cors')

const UserModule = require('../modules/UserModule')
const GamesModule = require('../modules/GamesModule')
const CarsModule = require('../modules/CarsModule')
const ClassesModule = require('../modules/ClassesModule')
const TracksModule = require('../modules/TracksModule')
const SetupsModule = require('../modules/SetupsModule')

class ExpressController {
    app = express()

    constructor() {
        this.app.use(bodyParser.urlencoded({
            extended: true
        }))
        this.app.use(bodyParser.json())
        this.app.use(cors())

        /**
         * User Functions
         */

        this.app.post('/user/login', UserModule.login)
        this.app.post('/user/verify', UserModule.verify)
        this.app.post('/user/add', UserModule.add)
        this.app.post('/user/remove', UserModule.remove)
        this.app.post('/user/get', UserModule.get)
        this.app.post('/user/toggleAdmin', UserModule.toggleAdmin)
        this.app.post('/user/isAdmin', UserModule.isAdmin)
        this.app.post('/user/changePassword', UserModule.changePassword)

        this.app.post('/games/add', GamesModule.add)
        this.app.post('/games/remove', GamesModule.remove)
        this.app.post('/games/get', GamesModule.get)

        this.app.post('/cars/add', CarsModule.add)
        this.app.post('/cars/remove', CarsModule.remove)
        this.app.post('/cars/get', CarsModule.get)

        this.app.post('/classes/add', ClassesModule.add)
        this.app.post('/classes/remove', ClassesModule.remove)
        this.app.post('/classes/get', ClassesModule.get)

        this.app.post('/tracks/add', TracksModule.add)
        this.app.post('/tracks/remove', TracksModule.remove)
        this.app.post('/tracks/get', TracksModule.get)

        this.app.post('/setups/add', upload.array("file"), SetupsModule.add)
        this.app.post('/setups/remove', SetupsModule.remove)
        this.app.post('/setups/get', SetupsModule.get)
        this.app.post('/setups/download', SetupsModule.download)

        return this.app
    }
}

module.exports = ExpressController