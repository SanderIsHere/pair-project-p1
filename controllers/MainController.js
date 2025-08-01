const { sequelize } = require('../models'); 

const nodemailer = require('nodemailer');
const {
    Product,
    Category,
    User,
    Profile
} = require('../models/index')
class MainController {
    static home(req, res) {
        res.render('home')

    }

    static async homeSeller(req, res) {
        try {
            // res.send("under development")
            let product = await Product.findAll({
                include: [
                    {
                        model: User,
                        include: [
                            { model: Profile },

                        ]
                    },
                    { model: Category }
                ]
            })
            let user = await User.findByPk(req.session.userId, {
                include: [
                    { model: Profile }
                ]
            })
            // res.send(product)
            console.log(product);

            res.render('homeSeller', { product, user })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
    static async landingPage(req, res) {
        try {
            //    res.send("welcome to landing page") 
            let stores = await Product.findAll({
                include: {
                    model: Category
                }
            })
            // console.log(stores);
            // res.send(stores)
            res.render('landingPage', { stores })

        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async showProductDetails(req, res) {
        try {
            // res.send("On development, release soon")
            let { id } = req.params
            let productDet = await Product.findByPk(+id, {
                include: [
                    { model: Category }
                ]


            })
            // res.send(product)
            res.render('productDetails', { productDet })
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    // static async buyProduct(req, res) {
    //     try {
    //         // res.send("On development, release soon")
    //         let { id } = req.params
    //         const userId = req.user.id
    //         const userEmail = req.user.email
    //         const qty = 1

    //         const user = userEmail && userName ? { id: userId, email: userEmail} : await User.findByPk(userId, { transaction });

    //         let buyProduct = await Product.findByPk(+id)
    //         if (!buyProduct) throw "Product not found!"

    //         await Product.decrement({ stock: 1 }, {
    //             where: { id: +id }
    //         })
    //         res.redirect('/store')
    //     } catch (err) {
    //         console.log(err);
    //         res.send(err)

    //     }
    // }

    static async buyProduct(req, res) {
        let transaction;
        try {
            transaction = await sequelize.transaction();

            let { id } = req.params;
            const userId = req.session.userId;
            const qty = 1;

            const buyProduct = await Product.findByPk(+id, { transaction });
            if (!buyProduct) {
                await transaction.rollback();
                throw "Product not found!";
            }

            // Cek apakah stok cukup
            if (buyProduct.stock < qty) {
                await transaction.rollback();
                throw "Product is out of stock!";
            }

            // Dekrementasi stock
            await Product.decrement({ stock: qty }, {
                where: { id: +id },
                transaction
            });

            // Ambil data user yang lengkap
            const user = await User.findByPk(userId, { transaction });

            if (!user) {
                await transaction.rollback();
                throw "User not found!";
            }

            // Panggil fungsi pengirim email
            // Gunakan `await` agar proses pengiriman email selesai sebelum respons dikirim
            await MainController.sendEmailNotif(buyProduct, user, qty);

            await transaction.commit();

            res.redirect('/store');

        } catch (err) {
            if (transaction) {
                await transaction.rollback();
            }
            console.error(err);
            res.status(500).send(err.message || err);
        }
    }

    static async sendEmailNotif(product, user, qty) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `Order Confirmation: ${product.productName}`,
                html: `
                    <h1>Thank You for Your Purchase!</h1>
                    <p>Dear ${user.username},</p>
                    <p>Your order for <b>${product.productName}</b> (${qty} unit) has been successfully placed.</p>
                    <p>Total price: $${(product.price * qty).toFixed(2)}</p>
                    <p>We appreciate your business!</p>
                    <p>Best regards,</p>
                    <p>AH--OK Sports Apparel</p>
                `,
                text: `Dear ${user.username},\nYour order for ${product.productName} (${qty} unit) has been successfully placed.\nTotal price: $${(product.price * qty).toFixed(2)}\nThank you for your purchase!`,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent to ${user.email}:`, info.response);
            return true;
        } catch (error) {
            console.error('Error sending purchase confirmation email:', error);
            // Anda bisa memilih untuk tidak me-throw error di sini agar proses pembelian tetap sukses meskipun email gagal dikirim
        }
    }
    static async addProductSeller(req, res) {
        try {
            res.send("On development, release soon")
            let product = await Product.findAll()

            res.render('addProduct', { product })
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async saveProductSeller(req, res) {
        try {
            res.send("On development, release soon")
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
    static async x(req, res) {
        try {
            res.send("On development, release soon")
        } catch (err) {
            console.log(err);
            res.send(err)

        }
    }
}

module.exports = MainController