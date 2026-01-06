const models = require('../models');
const Product = models.Product;
const Category = models.Category;

async function addproduct(req, res) {
    try {
        const { product_name, description, item_spec,no_of_copies,category_id,price,status } = req.body;

        const userId = req.userId; 

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const product = {
          product_name,
          description,
          item_spec,
          no_of_copies,
          category_id,
          price,
         status: status || 'Active'
        };
    
        const result = await Product.create(product);
    
        res.status(200).json({
          message: "Product added successfully",
          Product : result
        });
        
    } catch (error) {
        res.status(400).json({
          message: "Product not added, something went wrong",
          error: error.message || error,
        });
        
    }
}

async function getproduct(req, res) {
    try {
        const userId = req.userId; //? Set by authMiddleware
    
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }
    
        const product = await Product.findAll({ where : {status: 'Active'},
            
          attributes: { exclude:[ 'createdAt', 'updatedAt']  }, //& Hide timestamp
          include : [{
            model : Category,
            attributes : ['id','name'],
          }]
      
        });
    
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        res.status(200).json({
          message: 'Product fetched successfully',
          product
        });
        
    } catch (error) {
        res.status(400).json({
            message: "Product could not fetch something went wrong",
            error: error.message || error,
        });
    }
}

async function updateproduct(req, res) {
    try {
        const { no_of_copies,status,price,category_id } = req.body;

        const userId = req.userId; 
        const productId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

       const [updatedRows] = await Product.update(
            { no_of_copies,status,price,category_id },
            { where: { id: productId} }
        );
       
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Product not found or nothing changed' });
        }
    
        const updatedProduct = await Product.findByPk(productId);
    
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
          message: "Product successfully",
        });
    } catch (error) {
        res.status(400).json({
            message: "Product not updated, something went wrong",
            error: error.message ||error
        });
    }
}

module.exports = {addproduct, getproduct, updateproduct}