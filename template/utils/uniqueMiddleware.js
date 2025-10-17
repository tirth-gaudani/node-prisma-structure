const isCheckDisposableEmail = require('is-check-disposable-email');
const { sendResponse } = require('../middleware/headerValidator');
const { prisma } = require('../modules/v1/prismaClient');

const uniqueCheck = {

    userCheckEmail: async (req, res, next) => {
        let { body } = req;
        try {
            if (isCheckDisposableEmail(body?.email)) {
                return sendResponse(req, res, 201, 'error', { keyword: "can_not_use_disposable_email", components: { email: body?.email } });
            }
            let userData = await prisma.tbl_user.findFirst({
                where: {
                    email: body?.email,
                    is_active: true,
                    is_delete: false,
                }
            });
            if (userData) {
                return sendResponse(req, res, 201, 'error', { keyword: 'text_email_already_exist', components: { key: body?.email } });
            } else {
                next();
            }
        } catch (error) {
            console.error('error in userCheckEmail --->>    ', error);
            return sendResponse(req, res, 201, 'error', { keyword: 'text_email_already_exist', components: { key: body?.email } });
        }
    },

    userCheckEmailForEdit: async (req, res, next) => {
        let { body } = req;
        let { user_type, user_id } = req.loginUser;
        try {
            if (isCheckDisposableEmail(body?.email)) {
                return sendResponse(req, res, 201, 'error', { keyword: "can_not_use_disposable_email", components: { email: body?.email } });
            }
            let userData = await prisma.tbl_user.findFirst({
                where: {
                    id: {
                        not: user_id
                    },
                    email: body?.email,
                    is_active: true,
                    is_delete: false,
                    is_verify: true,
                }
            });
            if (userData) {
                return sendResponse(req, res, 201, 'error', { keyword: 'text_email_already_exist', components: { key: body?.email } });
            } else {
                next();
            }
        } catch (error) {
            console.error('error in userCheckEmailForEdit --->>    ', error);
            return sendResponse(req, res, 201, 'error', { keyword: 'text_email_already_exist', components: { key: body?.email } });
        }
    },

}

module.exports = uniqueCheck;