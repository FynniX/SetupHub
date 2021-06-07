const UserEntity = require('../entities/user')
const {getManager} = require('typeorm')
const crypto = require('crypto')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const SECRET_TOKEN = crypto.randomBytes(2048).toString('hex')

async function login(req, res) {
    const user = await getManager().findOne(UserEntity, {
        email: req.body.email
    })

    if (user !== undefined) {
        if (await argon2.verify(user["password"], req.body.password)) {
            const token = createToken(user["id"], user["isAdmin"])

            await getManager().update(UserEntity, user["id"], {
                token
            })

            return res.send({
                success: true,
                token,
                isAdmin: user["isAdmin"]
            })
        }
    }

    res.send({
        success: false
    })
}

async function verify(req, res) {
    const decoded = TokenIsValid(req.body.token)

    res.send({
        success: decoded !== false,
        decoded
    })
}

async function add(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().insert(UserEntity, {
                email: req.body.email,
                password: await argon2.hash(req.body.password),
                token: "",
                isAdmin: false
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

async function get(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin) {
            res.send(await getManager().find(UserEntity))
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
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin && jwt.decode(req.body.token).id !== req.body.id) {
            res.send(await getManager().delete(UserEntity, req.body.id))
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

async function toggleAdmin(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false && jwt.decode(req.body.token).isAdmin && jwt.decode(req.body.token).id !== req.body.id) {
            res.send(await getManager().update(UserEntity, req.body.id, {
                isAdmin: req.body.isAdmin
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

async function changePassword(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false) {
            const user = await getManager().findOne(UserEntity, jwt.decode(req.body.token).id)

            if (await argon2.verify(user["password"], req.body.oldpassword)) {
                return res.send(await getManager().update(UserEntity, jwt.decode(req.body.token).id, {
                    password: await argon2.hash(req.body.newpassword),
                    token: ""
                }))
            }
        }
    } catch (err) {
        console.error(err)
    }

    res.send({
        error: "Insufficient Rights!"
    })
}

async function isAdmin(req, res) {
    try {
        if (TokenIsValid(req.body.token) !== false) {
            const user = await getManager().findOne(UserEntity, jwt.decode(req.body.token).id)

            if(user)
                return res.send(user.isAdmin)
        }
    } catch (err) {
        console.error(err)
    }

    res.send(false)
}

async function CreateAdmin() {
    const users = await getManager().find(UserEntity)

    if (users.length === 0) {
        await getManager().insert(UserEntity, {
            email: "admin@admin.com",
            password: await argon2.hash("123"),
            token: "",
            isAdmin: true
        })
    }
}

/**
 * JsonWebToken Functions
 */

function TokenIsValid(token) {
    try {
        return jwt.verify(token, SECRET_TOKEN)
    } catch (err) {
        console.error(err)
        return false;
    }
}

function createToken(id, isAdmin) {
    return jwt.sign({
        id,
        isAdmin
    }, SECRET_TOKEN, {expiresIn: '30d'})
}

module.exports = {
    login,
    verify,
    add,
    remove,
    get,
    toggleAdmin,
    isAdmin,
    TokenIsValid,
    CreateAdmin,
    changePassword
}