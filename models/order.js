'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.OrderDetails, { foreignKey: 'order_id' });
    }
  }
  Order.init({
    order_id: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    total_amount: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    grand_total: DataTypes.INTEGER,
    ship_to: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};