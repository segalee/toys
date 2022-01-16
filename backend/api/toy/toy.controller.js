
// const express = require('express')
// // const cookieParser = require('cookie-parser')
// const cors = require('cors')
// const app = express()
// const toyService = require('./services/toy.service.js')

// // Express App Configurations
// app.use(express.json())
// // app.use(cookieParser())
// app.use(cors())
// app.use(express.static('public'))

const toyService = require('./toy.service.js');
const logger = require('../../services/logger.service')

// GET LIST
async function getToys(req, res) {

    const filterBy = {
        name: req.query.name || "",
        inStock: req.query.inStock || "",
        labels: req.query.labels || "",
        //  ? req.query.labels.split('_') : null,
    }
    // console.log('filterBy:', filterBy);

    const sortBy = {
        field: req.query.field || "",
        order: req.query.order || ""
    }

    try {
        const toys = await toyService.query(filterBy, sortBy)
        res.send(toys)
        // res.json(toys) ??????
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}




// GET BY ID 
async function getToyById(req, res) {
    try {
        const toyId = req.params.toyId
        const toy = await toyService.getById(toyId)
        res.send(toy)
    } catch (err) {
        logger.error('Failed to get car', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

// DELETE (Remove car)
async function removeToy(req, res) {
    try {
        const toyId = req.params.toyId
        const removedId = await toyService.remove(toyId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

// POST (add toy)
async function addToy(req, res) {
    try {
        const newToy = req.body;
        const savedToy = await toyService.add(newToy)
        res.send(savedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

// PUT (Update toy)

async function updateToy(req, res) {
    try {
        const newToy = req.body;
        const updatedToy = await toyService.update(newToy)
        res.send(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}



// app.listen(3030, () => console.log('🥨Server listening on port 3030🥨!'))

// const port = process.env.PORT || 3030;
// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })
// app.listen(port, () => {
//     console.log(`🥨App listening on port ${port}!🥨`)
// });



module.exports = {
    getToys,
    getToyById,
    addToy,
    updateToy,
    removeToy
}




// // app.get('/api/toy', (req, res) => {
// //     const filterBy = {
// //         name: req.query.name,
// //         inStock: req.query.inStock,
// //         labels: req.query.labels ? req.query.labels.split('_') : null,
// //     }
// //     // let filterBy = null
// //     toyService.query(filterBy)
// //         .then(toys => {
// //             res.send(toys)
// //             // console.log('toys:', toys);
// //         })
// //         .catch(err => {
// //             res.send(err)
// //         })
// // })


// // GET BY ID

// app.get('/api/toy/:toyId', (req, res) => {
//     const toyId = req.params.toyId
//     toyService.getById(toyId)
//         .then(toy => {
//             res.send(toy)
//         })
//         .catch(err => {
//             res.status(404).send('No such toy')
//         })
// })

// app.delete('/api/toy/:toyId', (req, res) => {
//     const toyId = req.params.toyId
//     toyService.remove(toyId)
//         .then(() => {
//             res.send(toyId)
//             console.log('toyId is deleted!:', toyId);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(406).send('You cant delete this toy')
//         })
// })


// app.post('/api/toy', (req, res) => {
//     const newToy = req.body;
//     console.log('newToy:', newToy);

//     toyService.save(newToy)
//         .then(savedToy => {
//             res.send(savedToy)
//         })

// })


// app.put('/api/toy/:toyId', (req, res) => {
//     const newToy = req.body;
//     toyService.save(newToy)
//         .then(updatedToy => {
//             res.send(updatedToy)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(401).send('could not update')
//         })
// })



// // app.listen(3030, () => console.log('🥨Server listening on port 3030🥨!'))

// // const port = process.env.PORT || 3030;
// // app.get('/**', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// // })
// // app.listen(port, () => {
// //     console.log(`🥨App listening on port ${port}!🥨`)
// // });

