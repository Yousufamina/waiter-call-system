const express = require("express");
const router = express.Router();
// const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const middleware = require("../middleware/middleware");

/*
 user API
 */
router.get('/login', adminController.login);
router.get('/',middleware.admin ,adminController.index);
router.post('/login',adminController.loginPost);


module.exports = router;