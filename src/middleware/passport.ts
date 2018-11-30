import { ExtractJwt, Strategy } from 'passport-jwt'
import db from '../models'
import { CONFIG } from '../config/config'
import { PassportStatic } from 'passport';
const {to} = require('../services/util.service');
const { User } = db

export default function (passport: PassportStatic) {
  const opts = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  	secretOrKey: CONFIG.jwt_encryption
	};
  passport.use(new Strategy(opts, async function(jwt_payload, done) {
		let err, user;
		[err, user] = await to(User.findById(jwt_payload.user_id));
		if (err) {
				return done(err, false);
		}
		if (user) {
				return done(null, user);
		} else {
				return done(null, false);
		}
  }));
}
