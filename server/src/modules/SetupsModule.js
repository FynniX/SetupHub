const SetupsEntity = require('../entities/setups')
const {getManager} = require('typeorm')
const {TokenIsValid} = require('./UserModule')
const fs = require('fs')
const crypto = require('crypto')
const moment = require('moment')
const path = require('path')

async function add(req, res) {
    if (TokenIsValid(req.body.token) !== false) {
        const hash = crypto.randomBytes(12).toString('hex')
        fs.mkdirSync('src/setups/' + hash)

        req.files.forEach((value, index) => {
            const tmp_path = value.path

            const target_path = JSON.stringify(
                req.files.map((value1 => {
                    return 'src/setups/' + hash + '/' + value1.originalname
                }))
            )

            const src = fs.createReadStream(tmp_path)
            const dest = fs.createWriteStream(JSON.parse(target_path)[index])
            src.pipe(dest)
            src.on('end', async () => {
                if(req.files.length - 1 === index) {
                    await getManager().insert(SetupsEntity, {
                        filename: target_path,
                        game: req.body.game,
                        car: req.body.car,
                        track: req.body.track,
                        description: req.body.description,
                        downloads: 0,
                        date: moment().format('YYYY-MM-DD HH:mm:ss')
                    })
                    res.sendStatus(200);
                }
            });
            src.on('error', () => {
                res.sendStatus(500);
            });
        })
    } else {
        res.send({
            error: "Insufficient Rights!"
        })
    }
}

async function remove(req, res) {
    if (TokenIsValid(req.body.token) !== false) {
        res.send(await getManager().delete(SetupsEntity, req.body.id))
    } else {
        res.send({
            error: "Insufficient Rights!"
        })
    }
}

async function get(req, res) {
    if (TokenIsValid(req.body.token) !== false) {
        res.send(await getManager().find(SetupsEntity))
    } else {
        res.send({
            error: "Insufficient Rights!"
        })
    }
}

async function download(req, res) {
    if (TokenIsValid(req.body.token) !== false) {
        await getManager().update(SetupsEntity, req.body.id, {
            downloads: req.body.downloads
        })

        const files = JSON.parse(req.body.filename)

        const buffers = files.map((value, index) => {
            return fs.readFileSync(value)
        })

        res.send(buffers);
    } else {
        res.send({
            error: "Insufficient Rights!"
        })
    }
}

module.exports = {
    add,
    remove,
    get,
    download
}