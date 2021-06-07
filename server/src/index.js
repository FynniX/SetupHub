require('reflect-metadata')
require('dotenv').config()

const {createConnection} = require("typeorm")
const {CreateAdmin} = require('./modules/UserModule')
const ExpressController = require("./classes/ExpressController")

/**
 * Express Start Section
 */

const app = new ExpressController()
const server = require('http').createServer(app)

/**
 * TypeORM Start Section
 */

createConnection().then(async () => {
    await CreateAdmin();

    /* Starting Webserver */
    server.listen(process.env.SERVER_PORT, () => console.log(`Listening on: http://localhost:${process.env.SERVER_PORT}`))
})