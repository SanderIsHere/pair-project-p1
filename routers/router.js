const express = require('express')
const UserController = require('../controllers/UserController')
const MainController = require('../controllers/MainController')
const router = express.Router()

// validasi role seller
const isSeller = function(req, res, next){
    if(req.session.userId && req.session.role !== 'seller'){
        const err = `Add listings only available for Seller`
        res.redirect(`/product?error=${err}`)
    }else{
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
  if(!req.session.userId){
    const err = 'Log in first please'
    res.redirect(`/logIn?error=${err}`)
  }else{
      next()
  }
})


router.get('/store', MainController.landingPage)

// router.get('/product', isSeller, MainController.landingPage)



module.exports = router