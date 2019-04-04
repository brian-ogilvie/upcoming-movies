'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    title: DataTypes.STRING,
    poster_path_small: DataTypes.STRING,
    poster_path_large: DataTypes.STRING,
    genres: DataTypes.ARRAY(DataTypes.STRING),
    release_date: DataTypes.DATE,
    overview: DataTypes.TEXT
  }, {underscored:true});
  Movie.associate = function(models) {
    // associations can be defined here
  };
  return Movie;
};