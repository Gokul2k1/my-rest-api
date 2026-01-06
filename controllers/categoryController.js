const { where } = require('sequelize');
const models = require('../models')
const Category = models.Category

async function addcategory(req, res) {
    try {
        const{ name, status} = req.body;

        const addcategory = {
         name,
         status: status || 'Active'
        };
    
        const result = await Category.create(addcategory);
    
        res.status(200).json({
          message: "category added successfully",
          Address: result,
        });

    } catch (error) {
        res.status(400).json({
          message: "category couldn't be added, something went wrong",
          error: error.message || error,
        });
    }
}

async function deletecategory(req, res) {
    try {
        const categoryId = req.params.id;
        const deletecategory = await Category.destroy({where : {id:categoryId}});

        if(deletecategory === 0) {
            return res.status(404).json({message: "No category to delete on the respective id"});
        }
        res.status(200).json({ message: 'Category deleted successfully' }); 
    
    } catch (error) {
        res.status(400).json({
          message: "category couldn't be deleted, something went wrong",
          error: error.message || error,
        });
    }
} 

async function getcategory(req, res) {
    try {
        const category = await Category.findAll({where: {status: 'Active'},
            attributes: {exclude:['createdAt', 'updatedAt']} //& Hide felds
        })
    
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
    
        res.status(200).json({
          message: 'Categoryfetched successfully',
          category
        });

    } catch (error) {
        res.status(400).json({
            message: "category coulldn't fetch, someting went wrong",
            error: error.message || error
        })
    }
    
}

module.exports = {addcategory, deletecategory, getcategory}

