const express = require('express');
const router = express.Router();
const middleware = require('../middleware/admin.middleware');
const adminController = require('../controllers/admin.controller');

// GET all admins
router.get('/', middleware.authenticate, adminController.getAllAdmins);

// GET admin
router.get('/me', middleware.authenticate, (req,res)=>{
    res.send(req.admin);
});

// POST admin
router.post('/', adminController.postAdmin);

// Login admin (generate auth token for login)
router.post('/login', adminController.loginAdmin);

// Logout admin (delete token)
router.delete('/me/token', middleware.authenticate, adminController.logoutAdmin);

module.exports=router;