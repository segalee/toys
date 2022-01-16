
// const fs = require('fs')
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
// let gToys = require('../../data/toy.json')


module.exports = {
    query,
    getById,
    remove,
    add,
    update
}


// async function query(currFilterBy = null) {
//     const criteria = _buildCriteria(filterBy)
//     try {
//         const collection = await dbService.getCollection('toy')
//         if (!currFilterBy.inStock && !currFilterBy.labels && !currFilterBy.name) {
//             // currFilterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//         }
//         var toys = await collection.find(criteria).toArray()

//         //     currFilterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//         // }        const collection = await dbService.getCollection('toy')
//         var toys = await collection.find(criteria).toArray()
//         return toys


//     } catch (err) {
//         logger.error('cannot find toys', err)
//         throw err
//     }
// }


async function query(currFilterBy, sortBy) {
    try {
        const collection = await dbService.getCollection("toy");
        const criteria = _buildCriteria(currFilterBy);
        let toys
        if (sortBy?.field && sortBy?.order) {
            if (!['asc', 'desc'].includes(sortBy.order)) {
                throw new Error(`invalid order type ${order}`)
            }
            const order = sortBy.order === 'asc'
                ? 1 :
                sortBy.order === 'desc' ?
                    -1 :
                    ''

            const field = [sortBy.field]
            toys = await collection.find(criteria).sort({ [field]: order }).toArray();
        } else {
            toys = await collection.find(criteria).toArray();
        }
        return toys;
    } catch (err) {
        logger.error("cannot find toys", err);
    }

}

//     // console.log('filterBy:', filterBy);
//     if (!filterBy.inStock && !filterBy.labels && !filterBy.name) {
//         filterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//         return Promise.resolve(gToys)
//     }

//     const filteredToys = _getFilteredToys(filterBy)
//     // console.log('filteredToys:', filteredToys);
//     return Promise.resolve(filteredToys)

// }


// function _buildCriteria(filterBy) {
// const ctr = {}
// if (!filterBy.name) {
//     ctr.name = ""
// }
// if (!filterBy.inStock) {
//     ctr.inStock = "ALL"
// }
// if (!filterBy.labels) {
//     ctr.labels = ["ALL"]
// }

//     if (filterBy.name) {
//         ctr.name = { $regex: filterBy.txt, $options: 'i' }
//     }
//     if (filterBy.inStock !== 'ALL') {
//         currFilterBy.inStock = (currFilterBy.inStock === 'true') ? true : false
//         ctr.inStock = { $eq: filterBy.inStock }
//     }
//     if (filterBy.labels.length) {
//         ctr.labels = { $all: filterBy.labels }
//         // }
//         console.log('ctr🥨🌯:', ctr);

//         return ctr
//     }
// }



function _buildCriteria(filterBy) {
    console.log("filterBy criteria 🎇", filterBy);
    const criteria = {};
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: "i" };
    }
    if (filterBy.inStock && filterBy.inStock !== "ALL") {

        filterBy.inStock = filterBy.inStock === "true" ? true : false;
        criteria.inStock = { $eq: filterBy.inStock };
    }
    if (filterBy.labels && filterBy.labels.length > 0) {
        // const splittedArr = filterBy.labels.split('_')
        // criteria.labels = { $all: splittedArr };
        criteria.labels = { $all: filterBy.labels };
    }

    return criteria;
}


// function _getFilteredToys(currFilterBy) {
//     // console.log('currFilterBy:', currFilterBy);
//     let entities = gToys || []
//     // if (!currFilterBy.inStock && !currFilterBy.labels && !currFilterBy.name) {
//     //     currFilterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//     // }

//     if (!currFilterBy.inStock) currFilterBy.inStock = 'ALL'
//     if (!currFilterBy.labels) currFilterBy.labels = ['ALL']
//     if (!currFilterBy.name) currFilterBy.name = ''
//     console.log('currFilterBy:', currFilterBy);

//     if (currFilterBy.inStock !== 'ALL') {
//         currFilterBy.inStock = (currFilterBy.inStock === 'true') ? true : false
//         entities = entities.filter((entity) => {
//             // console.log('entity:', entity);
//             // console.log('entity.inStock === currFilterBy.inStock:', entity.inStock === currFilterBy.inStock);

//             return entity.inStock === currFilterBy.inStock
//         })
//     }

//     if (currFilterBy.labels[0] !== 'ALL') {
//         // console.log('currFilterBy.labels:', currFilterBy.labels);
//         // entities = entities.filter((entity) => {

//         //     return entity.labels.includes(...currFilterBy.labels)
//         // })
//         if (!currFilterBy.labels) return
//         entities = entities.filter(entity => {
//             let isGood
//             currFilterBy.labels.forEach(label => {
//                 if (entity.labels.includes(label)) isGood = true
//             })
//             return isGood
//         })
//     }
//     if (currFilterBy.name !== '') {
//         entities = entities.filter((entity) => {
//             return entity.name.includes(currFilterBy.name)
//         })
//     }

//     return entities

// }


async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`error while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ '_id': ObjectId(toyId) })
        return toyId
    } catch (err) {
        logger.error(`can't remove ${toyId} ${err}`)
    }

}


async function add(toy) {
    console.log('toy:', toy);
    try {
        const collection = await dbService.getCollection('toy')
        const addedToy = collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error(`can't insert toy ${toyId}`)
    }
}

async function update(toy) {
    try {
        const toyId = ObjectId(toy._id)
        delete toy._id
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ "_id": toyId }, { $set: { ...toy } })
        return toy
    } catch (err) {
        logger.error(`can't update toy ${toyId} ${err}`)
        throw err
    }
}

// function save(newToy) {
//     if (newToy._id) {
//         gToys = gToys.map(toy => (toy._id === newToy._id) ? newToy : toy)
//     } else {
//         newToy._id = _makeId()
//         newToy.createdAt = Date.now()
//         // newToy.reviews = 'good toy'
//         newToy.inStock = true
//         gToys.push(newToy)
//     }
//     return _saveToysToFile().then(() => newToy)
// }



// function _isLabelsMatch(toy, filterLabels) {
//     if (filterLabels.length === 1 && filterLabels[0] === '') return true
//     return filterLabels.every(label => toy.labels.includes(label))
// }








// function _saveToysToFile() {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
//             if (err) {
//                 console.log(err);
//                 reject('Cannot write to file')
//             } else {
//                 console.log('Wrote Successfully!');
//                 resolve(gToys)
//             }
//         });
//     })
// }




// function query(filterBy) {
//     // console.log('filterBy:', filterBy);
//     if (!filterBy.inStock && !filterBy.labels && !filterBy.name) {
//         filterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//         return Promise.resolve(gToys)
//     }

//     const filteredToys = _getFilteredToys(filterBy)
//     // console.log('filteredToys:', filteredToys);
//     return Promise.resolve(filteredToys)

// }


// function _getFilteredToys(currFilterBy) {
//     // console.log('currFilterBy:', currFilterBy);
//     let entities = gToys || []
//     // if (!currFilterBy.inStock && !currFilterBy.labels && !currFilterBy.name) {
//     //     currFilterBy = { inStock: 'ALL', labels: ['All'], name: '' }
//     // }

//     if (!currFilterBy.inStock) currFilterBy.inStock = 'ALL'
//     if (!currFilterBy.labels) currFilterBy.labels = ['ALL']
//     if (!currFilterBy.name) currFilterBy.name = ''
//     console.log('currFilterBy:', currFilterBy);

//     if (currFilterBy.inStock !== 'ALL') {
//         currFilterBy.inStock = (currFilterBy.inStock === 'true') ? true : false
//         entities = entities.filter((entity) => {
//             // console.log('entity:', entity);
//             // console.log('entity.inStock === currFilterBy.inStock:', entity.inStock === currFilterBy.inStock);

//             return entity.inStock === currFilterBy.inStock
//         })
//     }

//     if (currFilterBy.labels[0] !== 'ALL') {
//         // console.log('currFilterBy.labels:', currFilterBy.labels);
//         // entities = entities.filter((entity) => {

//         //     return entity.labels.includes(...currFilterBy.labels)
//         // })
//         if (!currFilterBy.labels) return
//         entities = entities.filter(entity => {
//             let isGood
//             currFilterBy.labels.forEach(label => {
//                 if (entity.labels.includes(label)) isGood = true
//             })
//             return isGood
//         })

//     }

//     if (currFilterBy.name !== '') {
//         entities = entities.filter((entity) => {
//             return entity.name.includes(currFilterBy.name)
//         })
//     }

//     return entities

// }


// function getById(toyId) {
//     const toy = gToys.find(toy => toy._id === toyId)
//     if (!toy) return Promise.reject(`No such toy ${toyId}`)
//     return Promise.resolve(toy)
// }


// function remove(toyId) {
//     gToys = gToys.filter(toy => toy._id !== toyId)
//     return _saveToysToFile()
// }

// function save(newToy) {
//     if (newToy._id) {
//         gToys = gToys.map(toy => (toy._id === newToy._id) ? newToy : toy)
//     } else {
//         newToy._id = _makeId()
//         newToy.createdAt = Date.now()
//         // newToy.reviews = 'good toy'
//         newToy.inStock = true
//         gToys.push(newToy)
//     }
//     return _saveToysToFile().then(() => newToy)
// }



// // function _isLabelsMatch(toy, filterLabels) {
// //     if (filterLabels.length === 1 && filterLabels[0] === '') return true
// //     return filterLabels.every(label => toy.labels.includes(label))
// // }




// function _makeId(length = 5) {
//     var txt = '';
//     var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < length; i++) {
//         txt += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return txt;
// }




// function _saveToysToFile() {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
//             if (err) {
//                 console.log(err);
//                 reject('Cannot write to file')
//             } else {
//                 console.log('Wrote Successfully!');
//                 resolve(gToys)
//             }
//         });
//     })
// }
