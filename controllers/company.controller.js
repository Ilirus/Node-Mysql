const { Company } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async (req, res) => {
  const user = req.user;
  const company_info = req.body;
  let err, company, company_json;
  [err, company] = await to(Company.create(company_info));
  if (err) {
    return ReE(res, err, 422);
  }
  company.addUser(user, { through: { status: 'started' }})
  [err, company] = await to(company.save());
  if (err) {
    return ReE(res, err, 422);
  }
  company_json = company.toWeb();
  company_json.users = [{user:user.id}];
  return ReS(res, {company:company_json}, 201);
}
module.exports.create = create;

const getAll = async function(req, res) {
  const companies_json = []
  const user = req.user;
  let err, companies;
  [err, companies] = await to(user.getCompanies({include: [ {association: Company.Users} ] }));
  for (const i in companies) {
      const company = companies[i];
      const users = company.Users;
      const company_info = company.toWeb();
      const users_info = [];
      for (const i in users) {
        const user = users[i];
        // let user_info = user.toJSON();
        users_info.push({user:user.id});
      }
      company_info.users = users_info;
      companies_json.push(company_info);
  }

  console.log('c t', companies_json);
  return ReS(res, {companies:companies_json});
}
module.exports.getAll = getAll;

const get = function(req, res){
  const company = req.company;
  return ReS(res, {company:company.toWeb()});
}
module.exports.get = get;

const update = async function(req, res){
  let err, company, data;
  company = req.company;
  data = req.body;
  company.set(data);
  [err, company] = await to(company.save());
  if (err) {
    return ReE(res, err);
  }
  return ReS(res, {company:company.toWeb()});
}
module.exports.update = update;

const remove = async function(req, res){
  let company, err;
  company = req.company;
  [err, company] = await to(company.destroy());
  if (err) {
    return ReE(res, 'error occured trying to delete the company');
  }
  return ReS(res, {message:'Deleted Company'}, 204);
}
module.exports.remove = remove;