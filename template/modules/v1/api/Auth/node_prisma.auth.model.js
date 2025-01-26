const { sendResponse } = require('../../../../middleware/node_prisma.headerValidator');
const { jwt_sign, sendEmail, generateRandomNumericString } = require('../../../../utils/node_prisma.common');
const bcrypt = require('bcryptjs');
const { FRONT_BASE_URL, APP_NAME } = require('../../../../config/node_prisma.constants');
const { insertUser, updateUser, userData, checkUserExists } = require('../../models/node_prisma.userModel');
const email_verify_template = require('../../../../views/email_templates/node_prisma.email_verify_template');

//////////////////////////////////////////////////////////////////////
//                            Auth API                              //
//////////////////////////////////////////////////////////////////////
let Auth = {

    sendVerificationEmail: async (req, verifyToken, isNew = false) => {
        try {
            let { body } = req;
            const emailPath = isNew ? "verify/" : "reset-password/"
            let mail_otp_user = email_verify_template({ verify_link: `${FRONT_BASE_URL}${emailPath}${verifyToken}` }, isNew);
            setTimeout(() => {
                sendEmail(body?.email?.toLowerCase(), isNew ? `${APP_NAME} - email verification` : `${APP_NAME} - Password Reset Request`, mail_otp_user);
            }, 100);
            return true;
        } catch (e) {
            console.log('e :', e);
            return e;
        }
    },

    signUp: async (req, res) => {
        try {
            let { body } = req;
            const password = await bcrypt.hash(body?.password, 10);
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 2); // Expired in 2 minutes
            const verifyToken = await generateRandomNumericString(64);
            let userData = {
                email: body?.email,
                password,
                verify_token: verifyToken,
                verify_token_expiry: currentDate,
                is_active: true,
            };
            await insertUser(userData);
            await Auth.sendVerificationEmail(req, verifyToken, true);
            return sendResponse(req, res, 200, 'success', { keyword: "rest_keywords_user_signup_success", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    resendEmailVerification: async (req, res) => {
        try {
            let { body } = req;
            let userDetails = await checkUserExists({ id: body?.user_id });
            if (!userDetails) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_not_found", components: {} });
            }
            body.email = userDetails?.email;
            const verifyToken = await generateRandomNumericString(64);
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 2);  // Expired in 2 minutes
            let submitData = {
                verify_token: verifyToken,
                verify_token_expiry: currentDate,
            }
            await updateUser(body?.user_id, submitData);
            await Auth.sendVerificationEmail(req, verifyToken, true);
            return sendResponse(req, res, 200, 'success', { keyword: "verification_mail_sent_success", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    verifyAccount: async (req, res) => {
        try {
            let { body } = req;
            let userData = await checkUserExists({ verify_token: body?.verify_token, });
            if (!userData) {
                return sendResponse(req, res, 201, 'error', { keyword: "access_provided_link_for_verify_account", components: {} });
            }
            if (!userData?.is_active) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_inactive_by_admin", components: {} });
            }
            if (userData?.is_delete) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_account_delete", components: {} });
            }
            if (userData?.is_verify) {
                return sendResponse(req, res, 200, 'success', { keyword: "already_verify_your_account", components: {} });
            }
            const tokenExpiryDate = new Date(userData?.verify_token_expiry);
            if (tokenExpiryDate < new Date()) {
                return sendResponse(req, res, 201, 'error', { keyword: "verification_link_expired", components: {} });
            }
            let submitData = {
                is_verify: true,
                verified_at: new Date(),
            }
            await updateUser(userData?.id, submitData);
            return sendResponse(req, res, 200, 'success', { keyword: "account_has_been_verified", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    login: async (req, res) => {
        try {
            let { body } = req;
            let userDetails = await userData({ email: body?.email });
            if (!userDetails) {
                return sendResponse(req, res, 201, 'error', { keyword: "rest_keywords_user_invalid_credential", components: {} });
            }
            const isMatch = await bcrypt.compare(body?.password, userDetails?.password);
            if (!isMatch) {
                return sendResponse(req, res, 201, 'error', { keyword: "rest_keywords_user_password_invalid", components: {} });
            }
            delete userDetails?.password;
            if (!userDetails?.is_active) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_inactive_by_admin", components: {} });
            }
            if (userDetails?.is_delete) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_account_delete", components: {} });
            }
            if (!userDetails?.is_verify) {
                let token = await jwt_sign(userDetails?.id, null, "2days");
                body.token = token;
                await updateUser(userDetails?.id, { token, is_online: true, logged_at: new Date(), });
                return sendResponse(req, res, 201, 'verify', { keyword: "user_account_not_verified", components: {} }, { id: userDetails?.id, email: userDetails?.email, token }, '11');
            } else {
                let token = await jwt_sign(userDetails?.id, null, "30days");
                body.token = token;
                await updateUser(userDetails?.id, { token, is_online: true, logged_at: new Date(), });
                return sendResponse(req, res, 200, 'success', { keyword: "rest_keywords_user_login_success", components: {} }, { ...userDetails, token });
            }
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    forgotPassword: async (req, res) => {
        try {
            let { body } = req;
            let userDetails = await userData({ email: body?.email });
            if (!userDetails) {
                return sendResponse(req, res, 201, 'error', { keyword: "invalid_email", components: {} });
            }
            if (!userDetails?.is_active) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_inactive_by_admin", components: {} });
            }
            if (userDetails?.is_delete) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_account_delete", components: {} });
            }
            if (!userDetails?.is_verify) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_account_not_verified", components: {} }, {}, '11');
            }
            const forgotToken = await generateRandomNumericString(64);
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 1);  // Expired in 1 minutes
            let submitData = {
                forgot_token: forgotToken,
                forgot_token_expiry: currentDate,
            }
            await updateUser(userDetails?.id, submitData);
            await Auth.sendVerificationEmail(req, forgotToken, false);
            return sendResponse(req, res, 200, 'success', { keyword: "check_your_email_for_reset_password", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    resetPassword: async (req, res) => {
        try {
            let { body } = req;
            let userDetails = await checkUserExists({ forgot_token: body?.forgot_token, is_active: true, is_delete: false, is_verify: true });
            if (!userDetails) {
                return sendResponse(req, res, 201, 'error', { keyword: "use_provided_link_for_reset_password", components: {} });
            }
            const tokenExpiryDate = new Date(userData?.forgot_token_expiry);
            if (tokenExpiryDate < new Date()) {
                return sendResponse(req, res, 201, 'error', { keyword: "reset_password_link_expired", components: {} });
            }
            const isMatch = await bcrypt.compare(body?.new_password, userDetails?.password);
            if (isMatch) {
                return sendResponse(req, res, 201, 'error', { keyword: "old_password_same", components: {} });
            }
            const newPassword = await bcrypt.hash(body?.new_password, 10);
            let submitData = {
                password: newPassword,
                forgoted_at: new Date(),
                forgot_token: null,
                forgot_token_expiry: null,
            }
            await updateUser(userDetails?.id, submitData);
            return sendResponse(req, res, 200, 'success', { keyword: "password_changed", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    userDetails: async (req, res) => {
        try {
            let { user_type, user_id } = req.loginUser;
            let getUserData = await userData({ id: user_id, is_active: true, is_delete: false, });
            if (!getUserData) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_details_failed", components: {} });
            }
            delete getUserData?.password;
            return sendResponse(req, res, 200, 'success', { keyword: "user_details_success", components: {} }, getUserData);
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    logout: async (req, res) => {
        try {
            let { user_type, user_id, } = req.loginUser;
            let submitData = {
                is_online: false,
                token: null,
            }
            await updateUser(user_id, submitData);
            return sendResponse(req, res, 200, 'success', { keyword: "logout_success", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    changePassword: async (req, res) => {
        try {
            let { body } = req;
            let { user_id } = req.loginUser;
            if (body?.new_password != body?.confirm_password) {
                return sendResponse(req, res, 201, 'error', { keyword: "new_password_and_confirm_same", components: {} });
            }
            let userDetails = await checkUserExists({ id: user_id, is_active: true, is_delete: false, });
            if (!userDetails) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_not_found", components: {} });
            }
            const isMatchPassword = body?.current_password ? await bcrypt.compare(body?.current_password, userDetails?.password) : false;
            if (!isMatchPassword) {
                return sendResponse(req, res, 201, 'error', { keyword: "current_password_not_match", components: {} });
            }
            const isMatch = await bcrypt.compare(body?.new_password, userDetails?.password);
            if (isMatch) {
                return sendResponse(req, res, 201, 'error', { keyword: "old_password_same", components: {} });
            }
            const newPassword = await bcrypt.hash(body?.new_password, 10);
            await updateUser(userDetails?.id, { password: newPassword });
            return sendResponse(req, res, 200, 'success', { keyword: "password_changed", components: {} });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

    editProfile: async (req, res) => {
        try {
            let { body } = req;
            let { user_type, user_id } = req.loginUser;
            let getUserData = await userData({ id: user_id, is_active: true, is_delete: false });
            if (!getUserData) {
                return sendResponse(req, res, 201, 'error', { keyword: "user_details_failed", components: {} });
            }
            let submitData = {
                name: body?.name ? body?.name : getUserData?.name,
                email: body?.email ? body?.email : getUserData?.email,
            };
            await updateUser(user_id, submitData);
            delete getUserData?.password;
            return sendResponse(req, res, 200, 'success', { keyword: "rest_keywords_user_profile_edit_success", components: {} }, { ...getUserData, ...submitData });
        } catch (e) {
            console.error('Error =---->>  ', e);
            return sendResponse(req, res, 201, 'error', { keyword: "something_went_wrong", components: {} }, e?.message);
        }
    },

}

module.exports = {
    Auth,
};