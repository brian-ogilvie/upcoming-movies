'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('updates', 'data', Sequelize.JSON)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('updates', 'data')
  }
};
