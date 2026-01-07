const models = require('../models')
const sequelize = models.sequelize;
const Cart = models.Cart;
const Product = models.Product;
const Order = models.Order;
const OrderDetails = models.OrderDetails;

async function create_order(req, res) {
    const transaction = await sequelize.transaction();
    try {
        const { cart_id, discount = 0,total_amount,ship_to,status} = req.body;

        const userId = req.userId; 
    
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }
        
        // const cart = await Cart.findByPk(cart_id);
        // if (!cart) {
        //     return res.status(404).json({ message: 'Product not found in the cart' });
        // }

        //? Allow single or multiple cart IDs
        const cartIds = Array.isArray(cart_id) ? cart_id : [cart_id];

        const carts = await Cart.findAll({
        where: { id: cartIds, user_id: userId },
        transaction
        });

        if (!carts.length) {
        return res.status(404).json({ message: 'No cart items found' });
        }

        //* Calculate grand total
        const grand_total = total_amount - discount;

        //& Create Order
        const order = await Order.create(
        {
            user_id: userId,
            total_amount,
            discount,
            grand_total,
            ship_to,
            status
        },
        { transaction }
        );

        //^ Generate order_id: ORD-DD-MM-ID
        const date = new Date();
        const orderCode = `ORD-${date.getDate()}-${date.getMonth() + 1}-${order.id}`;

        await order.update(
        { order_id: orderCode },
        { transaction }
        );

        //! Create Order Details
        const orderDetailsData = carts.map(cart => ({
        order_id: order.id,
        product_id: cart.product_id,
        quantity: cart.quantity,
        amount: cart.amount,
        status: cart.status
        }));

        await OrderDetails.bulkCreate(orderDetailsData, { transaction });

        // ? (Optional) Remove cart items after order
        await Cart.destroy({
        where: { id: cartIds },
        transaction
        });

        await transaction.commit();

        return res.status(201).json({
        message: 'Order Placed successfully',
        order_id: orderCode,
        // order
        });

    } catch (error) {
        res.status(400).json({
          message: "Order is not created, something went wrong",
          error: error.message || error,
        }); 
    }
}

async function fetch_order(req, res) {
    try {
        const userId = req.userId; 
    
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const order = await Order.findAll({ where : {user_id:userId},
            attributes: [ 'id','order_id','user_id','total_amount','discount','grand_total','ship_to','status'] ,
            include: [
                {
                    model: OrderDetails,
                    attributes: [
                        'id',
                        'order_id',
                        'product_id',
                        'quantity',
                        'amount',
                        'status'
                    ],
                    include : [{
                        model : Product,
                        attributes : ['product_name','price' ],
                    }]
                }
            ]
        });
    
        if (!order || order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order fetched successfully',
            order,
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Order could not fetch",
            error: error.message || error,
        })
    }
}
module.exports = {create_order, fetch_order} 