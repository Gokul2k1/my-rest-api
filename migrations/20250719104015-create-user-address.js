'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserAddresses', {
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
        onDelete: 'CASCADE',    // Optional: deletes addresses if user is deleted
        onUpdate: 'CASCADE'
      },
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type:Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Active'
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
     await queryInterface.addIndex('UserAddresses', ['user_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserAddresses');
  }
};