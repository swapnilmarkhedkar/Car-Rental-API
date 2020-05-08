const express = require('express');
const router = express.Router();
const _ = require('lodash');
const middleware = require('../middleware/admin.middleware');
const {Admin} = require('../models/Admin');

// GET all admins
router.get('/', middleware.authenticate, (req,res)=>{
    Admin.find().then( (admins)=>{
        res.send({admins});
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// GET admin
router.get('/me', middleware.authenticate, (req,res)=>{
    res.send(req.admin);
});

// POST admin
router.post('/', (req,res)=>{
    var body = _.pick(req.body, ['email', 'name', 'password']);
    var admin = new Admin(body);

    admin.save().then(()=>{
        return admin.generateAuthToken(); // Promise is returned
    }).then((token)=>{
        res.header('x-auth',token).send(admin);
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// Login admin (generate auth token for login)
router.post('/login', (req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    Admin.findByCredentials(body.email, body.password).then((admin)=>{
        return admin.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(admin);
        });
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

// Logout admin (delete token)
router.delete('/me/token', middleware.authenticate, (req,res)=>{
    req.admin.removeToken(req.token).then(()=>{
        res.status(200).send();
    }, ()=>{
        res.status(400).send();
    });
});

module.exports=router;