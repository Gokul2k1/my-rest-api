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
      Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
  }
  Product.init({
    product_name: DataTypes.STRING,
    description: DataTypes.STRING,
    item_spec: DataTypes.STRING,
    no_of_copies: DataTypes.INTEGER,
    status: DataTypes.STRING,
    price: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};