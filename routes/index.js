const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Remainder = require('../models/Remainder')

// @route GET /remainder
router.get('/remainder/:id', auth, async (req,res) => {
      const _id = req.params.id

      try{
          const remainder = await Remainder.findOne({_id})
          if(!remainder){
              res.status(400).send('Cannot Find Remainder')
          }
          res.send(remainder)
        } catch(e){
            res.status(500).send(e)
        }
})

// @route GET /remainder (get all remainders)
router.get('/remainder', auth, async(req, res) => {
    
    try {
        await req.user.populate({path: 'remainder'}).execPopulate()
        res.send(req.user.remainder)
    } catch (e) {
        res.status(500).send(e)
    }
})


// @route POST /remainder
router.post('/remainder', auth, async (req,res) => {
    const remainder = new Remainder({
        ...req.body,
        author: req.user._id
    })
    try {
        await remainder.save()
        res.status(201).send(remainder)
    } catch(e){
        res.status(400).send(e)
    }
})

// @route PATCH /remainder
router.patch('/remainder/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'scheduledDateTime', 'name']
    const isValid = updates.every((update) => allowedUpdates.includes(update))

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const remainder = await Remainder.findOne({ _id: req.params.id, author: req.user._id })

        if (!remainder) {
            res.status(404).send()
        }

        updates.forEach((update) => remainder[update] = req.body[update])
        await remainder.save()

        res.send(remainder)
    } catch (e) {
        res.status(500).send(e)
    }
})

// @route DELETE /remainder
router.delete('/remainder/:id', auth, async (req,res) => {
    try {
        const remainder = await Remainder.findOneAndDelete({ _id: req.params.id, author: req.user._id })

        if (!remainder) {
            return res.status(404).send()
        }
        res.send(remainder)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router