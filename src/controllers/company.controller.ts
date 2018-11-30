import { utilService } from "../services/util.service";
import db from '../models';

const { to, ReE, ReS } = utilService;
const { Company } = db;

export const create = async (req: any, res: any) => {
  const { user, body: {...company_info} } = req;
  console.error(company_info);
  let [err, company] = await to(Company.create(company_info));
  if (err) {
    return ReE(res, err, 422);
  }
  company.addUser(user, { through: { status: 'started' }});
  [err, company] = await to(company.save());
  if (err) {
    return ReE(res, err, 422);
  }
  const company_json = company.toWeb();
  company_json.users = [{user:user.id}];
  return ReS(res, {company:company_json}, 201);
}

export const getAll = async function(req: any, res: any) {
  const companies_json = []
  const { user } = req;
  let [err, companies] = await to(user.getCompanies({include: [ {association: Company.Users} ] }));
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

export const get = function(req: any, res: any){
  const company = req.company;
  return ReS(res, {company:company.toWeb()});
}

export const update = async function(req: any, res: any) {
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

export const remove = async function(req: any, res: any){
  let company, err;
  company = req.company;
  [err, company] = await to(company.destroy());
  if (err) {
    return ReE(res, 'error occured trying to delete the company');
  }
  return ReS(res, {message:'Deleted Company'}, 204);
}