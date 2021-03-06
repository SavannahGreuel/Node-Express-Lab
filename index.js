// import your node modules
const express = require ('express')
const db = require('./data/db.js');
const server = express();
var cors = require ('cors')

server.use(express.json())
server.use(cors());

// add your server code starting here

server.get('/api/posts', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({error: "the posts information could not be retrieved."})
    })
})

server.get('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then (post => {
        if (post) {
            res.status(200).json(post);
        }
        res.status(404).json({message: "The post with the specified ID does not exist."});
    })
    .catch (err => {
        res.status(500).json({error: "The post information could not be retrieved. "})
    })
})

//post new saying 
server.post('/api/posts', async (req, res) => {
    try {
        const userBody = req.body;
        const userId = await db.insert(userBody);
        res.status(201).json(userId);
    } catch (error) {
        res.status(500).json({ message: 'error creating post:', error})
    }
})

//puts an update according too id
server.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db.update(id,changes)
    .then(count => {
        if (count) {
            res.status(200).json({
                message: `${count} post(s) was updated`
            });
        } else {
            res.status(404).json({
                message: 'Post not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error updating post'
        })
    })
})

//deletes a post according to the id
server.delete('/api/posts/:id', (req, res) => {
    db.remove(req.params.id)
    .then(count => {
        res.status(200).json(count);
    })
    .catch(err => {
        res.status(500).json({
            message: 'Error deleting post', err
        })
    })
})

server.listen(8000, () => console.log( 'This server is alive and breathing!'))