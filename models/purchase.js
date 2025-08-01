'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Purchase.belongsTo(models.User)

      Purchase.hasMany(models.Purchase_Product, {
        foreignKey: 'PurchaseId'
      })
      Purchase.belongsToMany(models.Product, {
        through: models.Purchase_Product
      })

    }
  }
  Purchase.init({
    UserId:{
      type:  DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: "Users",
        id: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'

    },
    purchasedDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Purchase',
  });
  return Purchase;
};