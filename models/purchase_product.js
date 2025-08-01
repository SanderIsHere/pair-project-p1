'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase_Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Purchase_Product.belongsTo(models.Product,{
          foreignKey: 'ProductId'
  
      })
      Purchase_Product.belongsTo(models.Purchase, {
        foreignKey: 'PurchaseId'
      })
    }
  }
  Purchase_Product.init({
    PurchaseId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Purchases',
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    ProductId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'Products',
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Purchase_Product',
  });
  return Purchase_Product;
};