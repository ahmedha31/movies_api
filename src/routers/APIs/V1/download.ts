import express from 'express'
import App from '../../../middlewaer/puter'
var https = require('https')
const router = express.Router()
const root = process.cwd()
var config = require(root + '/config.json')

router.get('/:id', async (req, res) => {
    
        App.getdownloadlink(req.params.id).then((data) => {
            res.send(data!.link!)
        }).catch((err) => {
            res.send({
                status: false,
                msg: err.message,
            })
        })
   
})

router.get('/:id/info', async (req, res) => {
    App.getdownloadlink(req.params.id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send({
            status: false,
            msg: err.message,
        })
    })
})

router.get('/:id/links', async (req, res) => {
    App.getdownloadlink(req.params.id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send({
            status: false,
            msg: err.message,
        })
    })

}
)


module.exports = router
