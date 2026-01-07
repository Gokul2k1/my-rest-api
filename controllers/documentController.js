const models = require ('../models');
const Document = models.UserDocument;

async function storeDocument(req, res) {
    try {

        const userId = req.userId; 
        const status = req.body.status|| 'Active';

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const image = req.file ? req.file.path : null;

        if (!image) {
             return res.status(400).json({ message: 'Image file is required' });
        }

        const normalizedPath = image.replace(/\\/g, '/');
        // const publicUrl = `${req.protocol}://${req.get('host')}/${normalizedPath}`;

        const storedocument = {
            user_id: userId,
            image: normalizedPath,
            status
        };
    
        const result = await Document.create(storedocument);
    
        res.status(200).json({
          message: "User document saved successfully",
          Document: result,
        });
        
    } catch (error) {
        res.status(400).json({
          message: "User document not saved, something went wrong",
          error: error.message || error,
        });
        
    }
}

async function getDocument(req, res) {
    try {
    const userId = req.userId; //? Set by authMiddleware

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const document = await Document.findAll({ where : {user_id:userId,  status: 'Active'},
        attributes: { exclude:[ 'createdAt', 'updatedAt']  }, //& Hide timestamp
    
    });

    if (document.length == 0) {
        return res.status(404).json({ message: 'No active documents found for this user' });
    }
    //^ Build full image URLs
    const host = `${req.protocol}://${req.get('host')}`;

    const formattedDocuments = document.map(doc => {
        return {
            ...doc.toJSON(),
            image: doc.image ? `${host}/${doc.image}` : null
        };
    });

    res.status(200).json({
        message: 'Document fetched successfully',
        document:formattedDocuments
    });
    }catch (error) {
    res.status(400).json({
        message: 'Could not find user document',
        error: error.message || error,
    });
    
    }
}
 
async function updateDocument(req, res) {
    try {
        const userId = req.userId; 
        const documentId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        //? Handle new uploaded image (if present)
        const image = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
        const status = req.body.status;

        //* Build update object dynamically
        const updateData = {};
        if (image) updateData.image = image;
        if (status) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const [updatedRows] = await Document.update(updateData, {
            where: { id: documentId, user_id: userId }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'User document not found or nothing changed' });
        }

        const updatedDocument = await Document.findByPk(documentId);

        //& Format image as full URL
        const host = `${req.protocol}://${req.get('host')}`;
        const documentWithUrl = {
            ...updatedDocument.toJSON(),
            image: updatedDocument.image ? `${host}/${updatedDocument.image}` : null
        };

        res.status(200).json({
            message: "User document updated successfully",
            document: documentWithUrl,
        });

        
    } catch (error) {
    res.status(400).json({
        message: 'Could not update user document',
        error: error.message || error,
    });
        
    }
}

async function deleteDocument(req, res) {
    try {
        const userId = req.userId; 
        const documentId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }

        const deletedCount = await Document.destroy({ where: { id: documentId } });
    
        if (deletedCount === 0) {
          return res.status(404).json({ message: 'User document not found or already deleted' });
        }
    
        res.status(200).json({ message: 'User document deleted successfully' });
        
    } catch (error) {
        res.status(400).json({
        message: 'Could not update user document',
        error: error.message || error,
    });
        
    }
}

module.exports = {storeDocument,getDocument, updateDocument, deleteDocument } 