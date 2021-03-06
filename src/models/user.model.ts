import bcrypt from 'bcrypt';
import bcryptPromise from 'bcrypt-promise'
const jwt = require('jsonwebtoken');
const {TE, to} = require('../services/util.service');
import { CONFIG } from '../config/config'

export default (sequelize, DataTypes) => {
    const Model = sequelize.define('User', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
          type: DataTypes.STRING, 
          allowNull: true, 
          unique: true, 
          validate: { 
            isEmail: {
              msg: "Phone number invalid."
            } 
          }
        },
        phone: {
          type: DataTypes.STRING, 
          allowNull: true, 
          unique: true, 
          validate: { 
            len: {
              args: [7, 20], 
              msg: "Phone number invalid, too short."
            }, 
            isNumeric: { 
              msg: "not a valid phone number."
            } 
          }
        },
        password: DataTypes.STRING,
    });

    Model.associate = function(models){
      this.Companies = this.belongsToMany(models.Company, {through: 'UserCompany'});
    };

    Model.beforeSave(async (user, options) => {
      let err;
      if (user.changed('password')) {
        let salt, hash
        [err, salt] = await to(bcrypt.genSalt(10));
        if (err) {
          TE(err.message, true);
        }
        [err, hash] = await to(bcrypt.hash(user.password, salt));
        if (err) {
          TE(err.message, true);
        }
        user.password = hash;
      }
    });

    Model.prototype.comparePassword = async function (pw) {
      let err, pass
      if (!this.password) {
        TE('password not set');
      }
      [err, pass] = await to(bcrypt_p.compare(pw, this.password));
      if (err) {
        TE(err);
      }
      if (!pass) {
        TE('invalid password');
      }
      return this;
    }

    Model.prototype.getJWT = function () {
      const expiration_time = parseInt(CONFIG.jwt_expiration);
      return "Bearer " + jwt.sign({user_id:this.id}, CONFIG.jwt_encryption, {expiresIn: expiration_time});
    };

    Model.prototype.toWeb = function (pw) {
      return {firstName, lastName, email, phone, id} = this.toJSON();
    };
    
    return Model;
};
