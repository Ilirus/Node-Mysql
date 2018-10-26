const { User } = require('../models')
const validator = require('validator')
const { to, TE } = require('../services/util.service')

const getUniqueKeyFromBody = (body) => {
  let uniqueKey = body.uniqueKey
  if (typeof uniqueKey === 'undefined') {
    if (typeof body.email !== 'undefined') {
      uniqueKey = body.email
    } else if (typeof body.phone !== 'undefined') {
      uniqueKey = body.phone
    } else {
      uniqueKey = null
    }
  }
  return uniqueKey
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody

const createUser = async (userInfo) => {
  const errors = {}
  if (!userInfo.uniqueKey && !userInfo.email && !userInfo.phone) {
    errors.global = 'Please enter an email or phone number to register.'
  }
  if (!userInfo.password) {
    errors.password = 'Please enter a password to register.'
  }
  if (!userInfo.firstName) {
    errors.firstName = 'Please enter a firstName.'
  }
  if (!userInfo.lastName) {
    errors.lastName = 'Please enter a lastName.'
  }
  if (userInfo.email && !validator.isEmail(userInfo.email)) {
    errors.email = 'Invalid email.'
  }
  if (userInfo.phone && !validator.isMobilePhone(userInfo.phone, 'any')) {
    errors.phone = 'Invalid phone number.'
  }
  if (Object.keys(errors).length === 0) {
    const [err, user] = await to(User.create(userInfo))
    if (err) {
      if (userInfo.phone) {
        errors.phone = 'User already exists with that phone number'
      }
      if (userInfo.email) {
        errors.email = 'User already exists with that email'
      }
      TE(errors)
    }
    return user
  } else {
    TE(errors)
  }
}
module.exports.createUser = createUser

const authUser = async function(userInfo){//returns token
    let uniqueKey;
    let auth_info = {};
    auth_info.status = 'login';
    uniqueKey = getUniqueKeyFromBody(userInfo);

    if(!uniqueKey) TE('Please enter an email or phone number to login');


    if(!userInfo.password) TE('Please enter a password to login');

    let user;
    if(validator.isEmail(uniqueKey)){
        auth_info.method='email';

        [err, user] = await to(User.findOne({where:{email:uniqueKey}}));
        if(err) TE(err.message);

    }else if(validator.isMobilePhone(uniqueKey, 'any')){//checks if only phone number was sent
        auth_info.method='phone';

        [err, user] = await to(User.findOne({where:{phone:uniqueKey }}));
        if(err) TE(err.message);

    }else{
        TE('A valid email or phone number was not entered');
    }

    if(!user) TE('Not registered');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;