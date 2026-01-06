'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserDocuments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
         references: {
          model: 'Users',      
          key: 'id'
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE'
      },
      image: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue : 'Active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('UserDocuments',['user_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserDocuments');
  }
};