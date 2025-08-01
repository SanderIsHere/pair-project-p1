const express = require('express')
const UserController = require('../controllers/UserController')
const MainController = require('../controllers/MainController')
const router = express.Router()

// validasi role seller
const isSeller = function (req, res, next) {
    if (req.session.userId && req.session.role !== 'seller') {
        const err = `Add listings only available for Seller`
        res.redirect(`/product?error=${err}`)
    } else {
        next()
    }
}
const isBuyer = function (req, res, next) {
    if (req.session.userId && req.session.role !== 'buyer') {
        const err = `Only available for Buyer`
        res.redirect(`/product?error=${err}`)
    } else {
        next()
    }
}

router.get('/', MainController.home)
// Seller
router.get('/registers', UserController.showRegister)
router.post('/registers', UserController.saveRegister)

router.get('/logIn', UserController.showLogIn)
router.post('/logIn', UserController.saveLogIn)

// middleware buat ngecek
router.use(function (req, res, next) {
    console.log('Time:', Date.now())
    if (!req.session.userId) {
        const err = 'Log in first please'
        res.redirect(`/logIn?error=${err}`)
    } else {
        next()
    }
})


router.get('/store', isBuyer,MainController.landingPage)  //homepage
// router.get('/store/list', MainController.landingPage)  //list barang
router.get('/store/:id', isBuyer, MainController.showProductDetails) //detail barang
router.get('/store/:id/buy', isBuyer, MainController.buyProduct) //beli barang


router.get('/logout', UserController.logOut)


// seller
router.get('/product', isSeller, MainController.homeSeller)
router.get('/product/add', isSeller, MainController.addProductSeller)
router.post('/product/add', isSeller, MainController.saveProductSeller)


// params
router.get('/product/:id', isSeller, MainController.x) //lihat detail barang
router.get('/product/:id/add', isSeller, MainController.x) //tambahin stok
router.get('/product/:id/reduce', isSeller, MainController.x) //kurangin stok
router.get('/product/:id/delete', isSeller, MainController.x) //hapus barang


module.exports = router