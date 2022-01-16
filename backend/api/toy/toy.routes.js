
const express = require('express')
const router = express.Router()
const { log } = require('../../middlewares/logger.middleware')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getToys, getToyById, addToy, updateToy, removeToy, addReview } = require('./toy.controller')

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getToys)
router.get('/:toyId', getToyById)
// router.post('/', addToy)
router.post('/', requireAuth, requireAdmin, addToy)
// router.put('/:toyId', updateToy)
router.put('/:toyId', requireAuth, requireAdmin, updateToy)
// router.delete('/:toyId', removeToy)
router.delete('/:toyId', requireAuth, requireAdmin, removeToy)

module.exports = router