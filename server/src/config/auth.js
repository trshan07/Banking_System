const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const defaultPermissions = [
	'view_account',
	'manage_account',
	'view_transactions',
	'create_transactions',
	'apply_loans',
	'view_loans',
	'create_tickets',
	'view_tickets'
];

const isGoogleAuthConfigured = () => Boolean(
	process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

const getBackendUrl = () => process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

const getGoogleCallbackUrl = () => {
	return process.env.GOOGLE_CALLBACK_URL || `${getBackendUrl()}/api/auth/google/callback`;
};

const configurePassport = () => {
	if (passport._strategies.google || !isGoogleAuthConfigured()) {
		if (!isGoogleAuthConfigured()) {
			console.warn('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable it.');
		}
		return passport;
	}

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: getGoogleCallbackUrl()
			},
			async (_accessToken, _refreshToken, profile, done) => {
				try {
					const email = profile.emails?.[0]?.value?.toLowerCase();

					if (!email) {
						return done(new Error('Google account did not provide an email address.'));
					}

					const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || 'Google';
					const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'User';

					let user = await User.findOne({
						$or: [{ googleId: profile.id }, { email }]
					});

					if (!user) {
						user = new User({
							firstName,
							lastName,
							email,
							googleId: profile.id,
							password: crypto.randomBytes(32).toString('hex'),
							phone: 'Google OAuth',
							address: 'Google OAuth',
							role: 'customer',
							status: 'active',
							isEmailVerified: true,
							permissions: defaultPermissions,
							preferences: {
								notifications: { email: true, sms: false, push: true },
								language: 'en',
								theme: 'light',
								currency: 'USD'
							}
						});
					} else {
						user.googleId = user.googleId || profile.id;
						user.isEmailVerified = true;

						if (!user.firstName) {
							user.firstName = firstName;
						}

						if (!user.lastName) {
							user.lastName = lastName;
						}
					}

					await user.save();
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	return passport;
};

module.exports = {
	passport,
	configurePassport,
	isGoogleAuthConfigured
};
