const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')




async function query(filterBy = {}) {
    console.log('filterBy:', filterBy);

    try {
        const criteria = _buildCriteria(filterBy)
        // const criteria = {}
        const collection = await dbService.getCollection('review')
        // const reviews = await collection.find(criteria).toArray()
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            }
        ]).toArray()
        console.log('reviews:', reviews);

        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.username }
            review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name }
            // console.log('review🥱🥱🥱:', review);
            delete review.byUserId
            delete review.aboutToyId
            return review
        })
        console.log('reviews:', reviews);
        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(reviewId) }
        if (!isAdmin) criteria.byUserId = ObjectId(userId)
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    console.log('review:😘', review);
    try {
        const reviewToAdd = {
            byUserId: ObjectId(review.byUserId),
            aboutToyId: ObjectId(review.aboutToyId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd;
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.toyId) criteria.toyId = filterBy.toyId
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


