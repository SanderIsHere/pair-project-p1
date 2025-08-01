'use strict';
const {
  Model
} = require('sequelize');
const nodemailer = require('nodemailer');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: 'CategoryId'
      })
      Product.hasMany(models.Purchase_Product, {
        foreignKey: 'ProductId'
      })
      Product.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      Product.belongsToMany(models.Purchase, {
        through: models.Purchase_Product
      })
    }
    static async sendEmailNotif(product, user, qty) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        const mailOptions = {
          from: `"${process.env.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
          to: user.email, // Email penerima dari objek user
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

        let info = await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${user.email}:`, info.response);
        return true; // Beri sinyal sukses
      } catch (error) {
        console.error('Error sending purchase confirmation email:', error);
      }
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    price: {
      type: DataTypes.INTEGER
    },
    stock: {
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'

    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};