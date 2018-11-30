import express from 'express'
import passport from 'passport'
import path from 'path'
import appPassport from './../middleware/passport'
import * as custom from './../middleware/custom'
import { HomeController, CompanyController, UserController } from '../controllers';
const router = express.Router();
appPassport(passport)
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    status: 'success', 
    message: 'Parcel Pending API', 
    data: {
      version_number: 'v1.0.0'
    }
  })
});

// Users Start
router.post('/users', UserController.create);
router.get('/users', passport.authenticate('jwt', {session:false}), UserController.get);
router.put('/users', passport.authenticate('jwt', {session:false}), UserController.update);
router.delete('/users', passport.authenticate('jwt', {session:false}), UserController.remove);
router.post('/users/login', UserController.login);
// Users End
// Companies Start
router.post('/companies',passport.authenticate('jwt', {session:false}), CompanyController.create);
router.get('/companies',passport.authenticate('jwt', {session:false}), CompanyController.getAll);

router.get(
  '/companies/:company_id', 
  passport.authenticate('jwt', {session:false}), 
  custom.company, 
  CompanyController.get
);
router.put(
  '/companies/:company_id', 
  passport.authenticate('jwt', {session:false}), 
  custom.company, 
  CompanyController.update
);
router.delete(
  '/companies/:company_id', 
  passport.authenticate('jwt', {session:false}), 
  custom.company, 
  CompanyController.remove
);
// Companies End

router.get('/dash', passport.authenticate('jwt', {session:false}),HomeController.Dashboard)

//********* API DOCUMENTATION **********
router.use('/docs/api.json', express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs', express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
export default router;
