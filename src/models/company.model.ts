const {TE, to} = require('../services/util.service');
import 

export default (sequelize: any, DataTypes: any) => {
  const Model = sequelize.define('Company', {
    name: DataTypes.STRING
  });

  Model.associate = function (models: any) {
    this.Users = this.belongsToMany(models.User, {through: 'UserCompany'});
  };

  Model.prototype.toWeb = function (pw: any) {
    const json = this.toJSON();
    return json;
  };

  return Model;
};