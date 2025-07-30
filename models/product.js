'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category,{
        foreignKey: 'CategoryId'
      })
      Product.belongsToMany(models.Purchase, {
        through:models.Purchase_Product
      })
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