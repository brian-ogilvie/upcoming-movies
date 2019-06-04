'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('updates', 'model', {
      allowNull: false,
      type: Sequelize.STRING,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('updates', 'model', {
      allowNull: false,
      type: Sequelize.ENUM(['genres', 'movies'])
    })
  }
};
