const parseError = require('parse-error')
const { to } = require('await-to-js');

class AppError {
  message?: string
  name?: string
  stack?: string
  constructor (errors: {[key: string]: string | number}) {
    this.message = JSON.stringify(errors);
    this.name = 'AppError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    } else {
      this.stack = (new Error()).stack;
    }
  }
}

export const utilService = {
  to: async (promise: Promise<any[]>) => {
    const [err, res] = await to(promise);
    if (err) {
      return [parseError(err), null];
    }
    return [null, res];
  },
  ReE: (res: any, err: any, code?: number) => { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
      const error = JSON.parse(err.message);
      if (error.serverStatus) {
        code = error.serverStatus;
      }
      delete error.serverStatus;
      err = error;
    }
    if (code) {
      res.statusCode = code;
    }
    return res.json({success: false, errors: err});
  },
  ReS: <T>(res: any, data: any, code?: number): T => { // Success Web Response
    let send_data = {success:true};
    if (typeof data == 'object') {
      send_data = Object.assign(data, send_data);//merge the objects
    }
    if (typeof code !== 'undefined') {
      res.statusCode = code;
    }
    return res.json(send_data)
  },
  TE: (errors: {[key: string]: string | number}, status?: number): never => { // TE stands for Throw Error
    if (status) {
      errors.serverStatus = status;
    }
    throw new AppError(errors)
  }
}
