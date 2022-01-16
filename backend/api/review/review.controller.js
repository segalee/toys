const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const reviewService = require('./review.service')
const toyService = require('../toy/toy.service')



async function getReviews(req, res) {
    console.log('req.query:', req.query);
    try {
        const reviews = await reviewService.query(req.query)
        console.log('reviews:', reviews);
        res.send(reviews)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

async function deleteReview(req, res) {
    try {
        await reviewService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete review', err)
        res.status(500).send({ err: 'Failed to delete review' })
    }
}


async function addReview(req, res) {
    try {
        var review = req.body
        console.log('review:', review);

        review.byUserId = req.session.user._id
        review.aboutToy = await toyService.getById(review.toyId)
        console.log('aboutToyId:', review.toyId);

        toy = await toyService.update(review.aboutToy)

        review = await reviewService.add(review)
        console.log('review🍕:', review);

        // const fullUser = await userService.getById(user._id)

        // console.log('CTRL SessionId:', req.sessionID);
        // socketService.broadcast({ type: 'review-added', data: review, userId: review.byUserId })
        // socketService.emitToUser({ type: 'review-about-you', data: review, userId: review.aboutUserId })
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(review)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

module.exports = {
    getReviews,
    deleteReview,
    addReview
}