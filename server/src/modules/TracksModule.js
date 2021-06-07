const TracksEntity = require('../entities/tracks')
const {getManager} = require('typeorm')
const {TokenIsValid} = require('./UserModule')
const jwt = require('jsonwebtoken')

async function add(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().insert(TracksEntity, {
                name: req.body.name,
                folder: req.body.folder,
                game: req.body.game
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
            res.send(await getManager().delete(TracksEntity, req.body.id))
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
            res.send(await getManager().find(TracksEntity))
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