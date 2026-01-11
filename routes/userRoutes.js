const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
const documentController = require('../controllers/documentController');
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const categoryController = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');
const upload = require('../middleware/uploadMiddleware');
const orderController = require('../controllers/orderController');

//^ router.get('getuser', getUsers);
router.post('/createUser', userController.createUser);
router.post('/login', userController.login);
router.get('/getUser', auth, userController.getUser);
router.post('/updateUser',auth, userController.updateUser);
router.post('/deleteUser', auth,adminAuth,userController.deleteUser);
router.post('/logout', auth, userController.logout);

//? Address Routes
router.post('/addAddress', auth, addressController.addAddress);
router.get('/getAddress', auth, addressController.getAddress);
router.put('/updateAddress/:id', auth, addressController.updateAddress);
router.delete('/deleteAddress/:id', auth, addressController.deleteAddress);

//* Document Routes
router.post('/storeDocument', auth, upload.single('image'), documentController.storeDocument);
router.get('/getDocument', auth, documentController.getDocument);
router.put('/updateDocument/:id', auth, upload.single('image'), documentController.updateDocument);
router.delete('/deleteDocument/:id', auth, documentController.deleteDocument);

//& Product Routes
router.post('/addproduct', auth, adminAuth,productController.addproduct);
router.get('/getproduct', auth, productController.getproduct);
router.patch('/updateproduct/:id', auth, adminAuth,productController.updateproduct);

//! cart routes
router.post('/addcart', auth, cartController.addcart);
router.get('/cart', auth, cartController.cart);
router.patch('/updateCart/:id', auth, cartController.updateCart);
router.delete('/deleteCart/:id', auth, cartController.deleteCart);

//? Category routes
router.post('/addcategory',auth, categoryController.addcategory);
router.delete('/deletecategory/:id', auth,  categoryController.deletecategory);
router.get('/getcategory',categoryController.getcategory);

//* Order route
router.post('/create_order', auth, orderController.create_order);
router.get('/fetch_order', auth, orderController.fetch_order);

module.exports = router;