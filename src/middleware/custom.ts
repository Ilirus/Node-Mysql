import db from '../models'
const { Company } = db;
const { to, ReE, ReS } = require('../services/util.service');

export const company = async function (req: any, res: any, next = () => {}) {
  const company_id = req.params.company_id;
  const user = req.user;
  let err, company, users;
  [err, company] = await to(Company.findOne({where:{id:company_id}}));
  if (err) {
    return ReE(res, 'err finding company');
  }
  if (!company) {
    return ReE(res, 'Company not found with id: ' + company_id);
  }
  [err, users] = await to(company.getUsers());
  const users_array = users.map((obj: any) => String(obj.user));
  if (!users_array.includes(String(user._id))) {
    return ReE(res, 'User does not have permission');
  }
  req.company = company;
  next();
}