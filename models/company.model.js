const {TE, to} = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Company', {
    name: DataTypes.STRING
  });

  Model.associate = function(models){
    this.Users = this.belongsToMany(models.User, {through: 'UserCompany'});
  };

  Model.prototype.toWeb = function (pw) {
    const json = this.toJSON();
    return json;
  };

  return Model;
};