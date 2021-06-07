const ClassesEntity = require('../entities/classes')
const {getManager} = require('typeorm')
const {TokenIsValid} = require('./UserModule')
const jwt = require('jsonwebtoken')

async function add(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().insert(ClassesEntity, {
                name: req.body.name
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
            res.send(await getManager().delete(ClassesEntity, req.body.id))
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
            res.send(await getManager().find(ClassesEntity))
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