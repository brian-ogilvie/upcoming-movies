'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('movies', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      poster_path_small: {
        type: Sequelize.STRING
      },
      poster_path_large: {
        type: Sequelize.STRING
      },
      genres: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      release_date: {
        type: Sequelize.DATE
      },
      overview: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('movies');
  }
};