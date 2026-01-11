const bcrypt = require('bcrypt');
const models = require('../models');
const User = models.User;
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');


async function createUser(req, res) {
  try {
    const { name, email, password,username,mobile } = req.body;

    //!email duplication validation
    let extEmail = await User.findOne({ where: { email } });
    if(extEmail)
      return res.status(400).json({message:  `Sorry '${email}' mail has been already takken`});

    //?username duplication validation
    let extUsername = await User.findOne({ where: { username } });
    if(extUsername)
      return res.status(400).json({message:  `Sorry '${username}' username has been already takken`});

    //^mobile number duplication
    let extmobile = await User.findOne({where: {mobile}});
    if(extmobile)
      return res.status(400).json({message: `Sorry '${mobile}' number has been already taken`});

    //& Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      username,
      mobile
    };

    const result = await User.create(user);
    const { password: _password, ...userWithoutPassword } = result.get({ plain: true });


    // Generate JWT token
    const token = jwt.sign(
      {
        id: result.id,
        email: result.email,
        name: result.name
      },
      
      process.env.JWT_SECRET,
      { expiresIn: '1d' } 
    );

    res.status(200).json({
      message: "User record created successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "User record not created, something went wrong",
      error: error.message || error,
    });
  }
}

async function login(req, res) {
  try {
    const {email, password} = req.body

    //check the email is register or not
    let extMail = await User.findOne({ where: { email } });
    if(!extMail)
      return res.status(404).json ({message: `Sorry '${email}' is not register`})

  // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, extMail.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: extMail.id,
        email: extMail.email,
        name: extMail.name,
         is_admin: extMail.is_admin,
      },
      
      process.env.JWT_SECRET,
      { expiresIn: '1d' } 
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Could not login, please try again',
      error: error.message || error,
    });
  }
}

async function getUser(req, res) {
  try {
    const userId = req.userId; //? Set by authMiddleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const user = await User.findOne({ where : {id:userId, status: 'Active'},
      attributes: { exclude:['password', 'createdAt', 'updatedAt']  }, //& Hide password
  
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user
    });
  }catch (error) {
    res.status(400).json({
      message: 'Could not find user details',
      error: error.message || error,
    });
    
  }
}

async function updateUser(req, res) {
  try {

    const userId = req.userId;
    const { name, email, mobile, username } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }
    //!email duplication validation
    let extEmail = await User.findOne({ where: { email } });
    if(extEmail)
      return res.status(400).json({message:  `Sorry '${email}' mail has been already takken`});

    //?username duplication validation
    let extUsername = await User.findOne({ where: { username } });
    if(extUsername)
      return res.status(400).json({message:  `Sorry '${username}' username has been already takken`});

    //^mobile number duplication
    let extmobile = await User.findOne({where: {mobile}});
    if(extmobile)
      return res.status(400).json({message: `Sorry '${mobile}' number has been already taken`});

    //* Optional: Validate fields here
    if (!name && !email && !mobile &&!username) {
      return res.status(400).json({ message: 'Nothing to update' });
    }
    const [updatedRows] = await User.update(
      { name, email, mobile,username },
      { where: { id: userId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User not found or nothing changed' });
    }

    const updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });

    
  } catch (error) {
    res.status(400).json({
      message: 'could not update the user, Pls try again',
      error: error.message || error,
    })
  }
}


async function deleteUser(req, res) {
   try {
    const userId = req.userId;
     if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const deletedCount = await User.destroy({ where: { id: userId } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    res.status(200).json({ message: 'User deleted successfully' });

   } catch (error) {
    res.status(400).json({
      message: "User could not delete",
      error: error.message ||error
    })
    
   }
}


async function logout(req, res) {
  try {
     const userId = req.userId
     if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

      res.clearCookie('token'); 
    return res.status(200).json({ message: 'User logged out successfully' });

  } catch (error) {
    res.status(400).json({
      message: "User could not delete",
      error: error.message ||error
    })
    
  }
  
}


module.exports = {
     createUser, login, getUser, updateUser, deleteUser, logout} 