const models = require('../models')
const Cart = models.Cart;
const Product = models.Product;

async function addcart(req, res) {
    try {
        const { product_id, quantity} = req.body;

        const userId = req.userId; 

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // const price = product.price;
        // const totalAmount = price * (quantity || 1);

        const productQuantity = quantity || 1;
        const price = product.price;
        const totalAmount = price * productQuantity;

        //? Determine status based on stock availability
        let status;
        if (productQuantity > product.no_of_copies) {
          status = 'Out of Stock';
        } else {
          status = 'Available';
        }

        const cart = {
          user_id: userId,
          product_id,
          quantity : productQuantity,
          amount : totalAmount,
          status
        };
    
        const result = await Cart.create(cart);
    
        res.status(200).json({
          message: "Product added successfully to the cart",
        });
        
    } catch (error) {
        res.status(400).json({
          message: "Product not added to cart, something went wrong",
          error: error.message || error,
        });  
    }
}

async function cart(req, res) {
    try {
        const userId = req.userId; 
    
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }
    
        const cart = await Cart.findAll({ where : {user_id:userId},
          attributes: [ 'id', 'user_id','product_id','quantity','amount','status'] ,
          include : [{
            model : Product,
            attributes : ['product_name','price','description'],
          }]
        });
    
        if (!cart || cart.length === 0) {
          return res.status(404).json({ message: 'cart not found' });
        }

        const total_amount = cart.reduce((sum, item) => sum + (item.amount || 0), 0);
    
        res.status(200).json({
          message: 'Cart fetched successfully',
          cart,
          total_amount
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Something went wrong with the cart",
            error: error.message || error,
        });
        
    }
}

async function updateCart(req,res) {
  try {
    const { product_id, quantity } = req.body;

    const userId = req.userId; 
    const cartId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // const price = product.price;
    // const totalAmount = price * (quantity || 1);

    const productQuantity = quantity || 1;
    const price = product.price;
    const totalAmount = price * productQuantity;

    //? Determine status based on stock availability
    let status;
    if (productQuantity > product.no_of_copies) {
      status = 'Out of Stock';
    } else {
      status = 'Available';
    }

    const [updatedRows] = await Cart.update(
        { product_id, quantity: productQuantity, amount:totalAmount,status },
        { where: { id: cartId , user_id: userId,} }
    );
    
    if (updatedRows === 0) {
        return res.status(404).json({ message: 'Cart not found or nothing updated' });
    }

    const updatedCart = await Cart.findByPk(cartId);

    if (!updatedCart) {
        return res.status(404).json({ message: 'Cart data not found' });
    }
    res.status(200).json({
      message: "cart updated successfully",
    });

  } catch (error) {
    res.status(400).json({
      message:"Something went wrong, couldn't update the cart",
      error: error.message || error
    });
  }
}

async function deleteCart(req, res) {
  try {
    const userId = req.userId; 
    const cartId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }
    const deletedCart = await Cart.destroy({ where: { id: cartId } });
    
    if (deletedCart === 0) {
      return res.status(404).json({ message: 'Cart data not found or already deleted' });
    }

    res.status(200).json({ message: 'Cart data deleted successfully' });
    
  } catch (error) {
    res.status(400).json({
      message: "Something went wrong couldn't clear cart",
      error: error.message || error
    })
  }
}

module.exports = {addcart, cart, updateCart,deleteCart} 