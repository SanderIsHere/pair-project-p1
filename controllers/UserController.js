const {
    User
} = require('../models/index')
const bcrypt = require('bcryptjs')
class UserController {
    static async showRegister(req, res) {
        try {
            // res.send("xSeller")
            let role = ['seller', 'buyer']
            res.render('auth/registerForm', { role })
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async saveRegister(req, res) {
        try {
            // res.send("xSeller")
            let { email, password, role } = req.body

            await User.create({ email, password, role })
            res.redirect('/logIn');
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async showLogIn(req, res) {
        try {
            // res.send("xSeller")
            // let role = ['seller', 'buyer']
            const { error } = req.query
            res.render('auth/logInForm', { error })
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async saveLogIn(req, res) {
        try {
            // res.send("xSeller")
            let { email, password } = req.body
            const user = await User.findOne({
                where: {
                    email
                }
            })

            if (user) {
                const isValidPass = bcrypt.compareSync(password, user.password);
                if (isValidPass) {
                    return res.redirect('/logIn/landingPage')
                } else {
                    // throw "Wrong password"
                    let error = "Invalid email or password!"
                    return res.redirect(`/logIn?error=${error}`)
                }
            } else {
                const err = "User not found"
                return res.redirect(`/logIn?error=${err}`)
            }

        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
}

module.exports = UserController