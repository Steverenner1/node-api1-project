// implement your API here
const express = require('express');  //import

const db = require('./data/db.js');

const server = express();  //creating server

server.use(express.json());  //teaches express how to read JSON, needed for POST and PUT to work


//request/route handlers

server.get('/', (req, res) => {
    res.send('Testing');
});

server.get('/api/users', (req, res) => {
    db.find()
    .then(user => {res.status(200).json(user);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "The users information could not be retrieved."})
    });
});

server.post('/api/users', (req, res) => {
    const userData = req.body;
 
    db.insert(userData)
    .then(user => {
        res.status(201).json(user);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: "failed to add user to database"})
    });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "The user information could not be retrieved"});  
    });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(deleted => {
        res.status(200).json({ message: `user with id ${id} has been deleted`})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "The user could not be removed"});
    });
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userData = req.body;
    
    db.update(id, userData)
    .then(count => {
        if (count === 1 ){
            db.findById(id)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                console.log('error', err);
                res.status(500).json({ error: ' failed to find user from db'})
            });
        }
    })
        .catch(err => {
            console.log('error', err);
            res.status(500).json({ error: ' failed to find user from db'})
        });
});


const port = 5555;
server.listen(port, () => console.log('API on port 5555'));
