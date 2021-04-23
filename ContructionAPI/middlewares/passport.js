const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const { JWT_SECRET} = require('../configs/Const');

const ACCOUNT = require("../entities/S_ACCOUNT")
const generalSer = require("./generalfuntion");
//Vertify token with jwt
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
			secretOrKey: JWT_SECRET
		},
		async (payload, done) => {
			try {
				const user = await ACCOUNT.findById(payload.sub);
				if (!(user)) {
					return done(null, false);
				}
				else if((await generalSer.isAccess(user)) == false) {
					return done(null,false);
				}
				else
				{
					done(null, user);
				}
			} catch (error) {
				done(error, false);
			}
		}
	)
);

//If passed, return confirm user
passport.use(
	new LocalStrategy(
		{
			usernameField: 'account_name'
		},
		async (account_name, password, done) => {
			try {
				const user = await ACCOUNT.findOne({ account_name });
				if (!user) return done(null, false);
				if((await generalSer.isAccess(user)) == false) return done(null,false);
				const isCorrectPassword = await generalSer.isCompare(password,user.password);
				if (!isCorrectPassword) return done(null, false);
				done(null, user);
			} catch (error) {
				done(error, false,{code:error.status,message:error.message,success:false});

			}
		}
	)
);
