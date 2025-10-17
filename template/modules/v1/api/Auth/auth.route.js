const { checkBodyInline, checkToken, checkApiKey } = require('../../../../middleware/headerValidator.js');
const express = require('express');
const router = express.Router();
const authModel = require('./auth.model.js');
const auth_rules = require('./rules/auth.rules.js');
const { userCheckEmail, userCheckEmailForEdit } = require('../../../../utils/uniqueMiddleware.js');

//////////////////////////////////////////////////////////////////////
//                              Auth                                //
//////////////////////////////////////////////////////////////////////
router.post("/signup", checkApiKey, checkBodyInline(auth_rules["signup"]), userCheckEmail, authModel?.Auth?.signUp);

router.post("/resend-email", checkApiKey, checkBodyInline(auth_rules["resend_email"]), authModel?.Auth?.resendEmailVerification);

router.post("/verify-account", checkApiKey, checkBodyInline(auth_rules["verify_account"]), authModel?.Auth?.verifyAccount);

router.post("/login", checkApiKey, checkBodyInline(auth_rules["login"]), authModel?.Auth?.login);

router.post("/forgot-password", checkApiKey, checkBodyInline(auth_rules["forgot_password"]), authModel?.Auth?.forgotPassword);

router.post("/reset-password", checkApiKey, checkBodyInline(auth_rules["reset_password"]), authModel?.Auth?.resetPassword);

router.get("/user-details", checkApiKey, checkToken, authModel?.Auth?.userDetails);

router.get("/logout", checkApiKey, checkToken, authModel?.Auth?.logout);

router.post("/change-password", checkApiKey, checkToken, checkBodyInline(auth_rules["change_password"]), authModel?.Auth?.changePassword);

router.post("/edit-profile", checkApiKey, checkToken, checkBodyInline(auth_rules["edit_profile"]), userCheckEmailForEdit, authModel?.Auth?.editProfile);

module.exports = router;