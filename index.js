// implement your API here
const express = require('express');  //import

const db = require('./data/db.js');

const server = express();  //creating server

server.use(express.json());  //teaches express how to read JSON, needed for POST and PUT to work

//request/route handlers

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
        res.status(500).json({error: "The users information could not be retrieved."})
    })
});

server.post('/api/users', (req, res) => {
    // console.log(req.body);
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({error: "Please provide name and bio for the user."})
    } else {
        db.insert({ name, bio })
        .then(({ id }) => {
            db.findById(id)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: "The users information could not be retrived."})
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "There was an error while saving the user to the database"});
        });
    }
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
        if (!user) {
            res.status(404).json({error: "The user with the specified ID does not exist."});
        } else {
            res.json(user);
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({error: "The user information could not be retrieved"});
    });
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.remove(id)
    .then(deleted => {
        console.log(deleted);
        if (deleted) {
            res.status(204).end();
        } else {
            res.status(404).json({error: "The user with the specified ID does not exist."});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "The user could not be removed"});
    });
});

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name && !bio ) {
        return res.status(400).json({error: "Please provide name and bio for the user."});
    }
    db.update(id, { name, bio })
    .then(updated => {
        if (updated) {
            db.findById(id)
            .then(user => res.status(200).json(user))
            .catch(err => {
                console.log(err);
                res.status(500).json({error: "The user information could not be retrieved."});
            });
        } else {
            res.status(404).json({error: "The user with the specified ID does not exist."});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "The user information could not be modified."});
    });
});










const port = 5555;
server.listen(port, () => console.log('API on port 5555'));
