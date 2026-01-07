const models = require('../models');
const Address = models.UserAddress;

async function addAddress(req, res) {
    try {
    const { address, city, state,status } = req.body;

        const userId = req.userId; 

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const addaddress = {
          user_id: userId,
          address,
          city,
          state,
         status: status || 'Active'
        };
    
        const result = await Address.create(addaddress);
    
        res.status(200).json({
          message: "User address record created successfully",
          Address: result,
        });
      } catch (error) {
        res.status(400).json({
          message: "User record not created, something went wrong",
          error: error.message || error,
        });
      }
    }

    async function getAddress(req, res) {
      try {
        const userId = req.userId; //? Set by authMiddleware
    
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }
    
        const address = await Address.findAll({ where : {user_id:userId,  status: 'Active'},
          attributes: { exclude:[ 'createdAt', 'updatedAt']  }, //& Hide timestamp
      
        });
    
        if (!address) {
          return res.status(404).json({ message: 'Address not found' });
        }
    
        res.status(200).json({
          message: 'Address fetched successfully',
          address
        });
      }catch (error) {
        res.status(400).json({
          message: 'Could not find user address',
          error: error.message || error,
        });
        
      }
    }

    async function updateAddress(req, res) {
       try {
        const { address, city, state,status } = req.body;

        const userId = req.userId; 
        const addressId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

       const [updatedRows] = await Address.update(
            { address, city, state,status },
            { where: { id: addressId , user_id: userId,} }
        );
       
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'User address not found or nothing changed' });
        }
    
        const updatedAddress = await Address.findByPk(addressId);
    
        if (!updatedAddress) {
            return res.status(404).json({ message: 'User address not found' });
        }
        res.status(200).json({
          message: "User address record created successfully",
          Address: updatedAddress,
        });

        
       } catch (error) {
        res.status(400).json({
          message: 'Could not update user address',
          error: error.message || error,
        });
       } 
    }

    async function deleteAddress(req, res) {
       try {
        const userId = req.userId;
        const addressId = req.params.id;
         if (!userId) {
          return res.status(401).json({ message: 'Unauthorized: User ID missing' });
        }
    
        const deletedCount = await Address.destroy({ where: { id: addressId } });
    
        if (deletedCount === 0) {
          return res.status(404).json({ message: 'User address not found or already deleted' });
        }
    
        res.status(200).json({ message: 'User address deleted successfully' });
    
       } catch (error) {
        res.status(400).json({
          message: "User could not delete",
          error: error.message ||error
        })
        
       }
    }

module.exports = {addAddress, getAddress, updateAddress, deleteAddress} 