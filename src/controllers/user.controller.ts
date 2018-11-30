import { authService } from "../services/auth.service";
import { utilService } from "../services/util.service";

const { to, ReE, ReS } = utilService

export const create = async (req: any, res: any) => {
  const [err, user] = await to(authService.createUser(req.body))
  if (err) {
    console.log(err, user)
    return ReE(res, err, 200)
  }
  if (!user.toWeb || !user.getJWT) {
    return ReE(res, err, 500)
  }
  return ReS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201)
}

export const get = async function(req: any, res: any){
  const user = req.user;
  return ReS(res, {user:user.toWeb()});
}

export const update = async function(req: any, res: any){
  let err, user, data
  user = req.user;
  data = req.body;
  user.set(data);
  [err, user] = await to(user.save());
  if (err) {
    if (err.message=='Validation error') {
      err = 'The email address or phone number is already in use';
    }
    return ReE(res, err);
  }
  return ReS(res, {message :'Updated User: '+user.email});
}

export const remove = async function(req: any, res: any){
  let user, err;
  user = req.user;
  [err, user] = await to(user.destroy());
  if (err) {
    return ReE(res, 'error occured trying to delete user');
  }
  return ReS(res, {message:'Deleted User'}, 204);
}

export const login = async function(req: any, res: any) {
  const body = req.body;
  let err, user;
  [err, user] = await to(authService.authUser(req.body));
  if (err) {
    return ReE(res, err, 422);
  }
  return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}