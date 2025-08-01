const {
    User,
    Profile
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
            let { firstName, lastName, bornDate, email, password, role } = req.body

            let user = await User.create({ email, password, role })
            await Profile.create({
                firstName,
                lastName,
                bornDate,
                UserId: user.id
            })
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
                    req.session.userId = user.id
                    req.session.role = user.role

                    if (user.role === 'seller') {
                        res.redirect('/product')
                    } else {
                        res.redirect('/store')
                    }
                } else {
                    // throw "Wrong password"
                    let error = "Invalid email or password!"
                    res.redirect(`/logIn?error=${error}`)
                }
            } else {
                const err = "User not found"
                res.redirect(`/logIn?error=${err}`)
            }

        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }

    static async logOut(req, res) {
        try {
            // res.send("x")
            req.session.destroy((err) => {
                if (err) {

                    console.log(err);
                    return res.send(err)
                }
                res.redirect('/logIn')
            })
        } catch (error) {
            console.log(err);
            res.send(err)

        }
    }
}

module.exports = UserController