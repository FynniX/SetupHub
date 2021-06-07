const CarsEntity = require('../entities/cars')
const {getManager} = require('typeorm')
const {TokenIsValid} = require('./UserModule')
const jwt = require('jsonwebtoken')

async function add(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().insert(CarsEntity, {
                name: req.body.name,
                shorthand: req.body.shorthand,
                folder: req.body.folder,
                game: req.body.game,
                class: req.body.class
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
            res.send(await getManager().delete(CarsEntity, req.body.id))
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
            res.send(await getManager().find(CarsEntity))
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