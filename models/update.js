'use strict';
module.exports = (sequelize, DataTypes) => {
  const Update = sequelize.define('Update', {
    model: DataTypes.ENUM(['genres','movies'])
  }, {underscored: true});
  Update.associate = function(models) {
    // associations can be defined here
  };
  return Update;
};