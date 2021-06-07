const GamesEntity = require('../entities/games')
const {getManager} = require('typeorm')
const {TokenIsValid} = require('./UserModule')
const jwt = require('jsonwebtoken')

async function add(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().insert(GamesEntity, {
                name: req.body.name,
                shorthand: req.body.shorthand
            }))
        } else {
            res.send({
                error: "Insufficient Rights!"
            })
        }
    } catch (err) {
        res.send({
            error: "An Error occurred!"
        })
    }
}

async function remove(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().delete(GamesEntity, req.body.id))
        } else {
            res.send({
                error: "Insufficient Rights!"
            })
        }
    } catch (err) {
        res.send({
            error: "An Error occurred!"
        })
    }
}

async function get(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false) {
            res.send(await getManager().find(GamesEntity))
        } else {
            res.send({
                error: "Insufficient Rights!"
            })
        }
    } catch (err) {
        res.send({
            error: "An Error occurred!"
        })
    }
}

module.exports = {
    add,
    remove,
    get
}