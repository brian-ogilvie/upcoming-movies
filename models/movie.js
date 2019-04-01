'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    poster_path: DataTypes.ARRAY(DataTypes.STRING),
    genres: DataTypes.STRING,
    release_date: DataTypes.DATE,
    overview: DataTypes.TEXT
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};