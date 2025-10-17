const en = require('../languages/en.js');
const { t, default: localizify } = require('localizify');
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const { verifyTokenCheck } = require('../modules/v1/models/userModel.js');
const cache = new NodeCache();

const checkApiKey = function (req, res, next) {
    if (req.headers['api-key']) {
        let apiKey = req.headers['api-key'];
        if (apiKey && apiKey == process.env.API_KEY) {
            next();
        } else {
            sendResponse(req, res, 401, 'error', { keyword: 'invalid_api_key', components: {} });
        }
    } else {
        sendResponse(req, res, 401, 'error', { keyword: 'api_key_missing', components: {} });
    }
}

const checkToken = async function (req, res, next) {
    try {
        req.loginUser = {};
        let token = req.header('Authorization');
        if (!token) {
            throw new Error("token_missing");
        }
        token = token?.replace('Bearer ', '');
        const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(' <<<---- Token data ---->>> ', data);

        req.loginUser.user_type = data?.user_type;
        req.loginUser.user_id = data?.user_id;
        req.loginUser.token = token;

        if (data?.user_id) {
            let userData = cache.get(token);
            if (!userData) {
                userData = await verifyTokenCheck(token);
                cache.set(token, userData, 10);
            }
            if (!userData) throw new Error('token_expired');
            if (userData?.user?.is_active == false) throw new Error('user_inactive_by_admin');
            if (userData?.user?.is_delete == true) throw new Error('user_account_delete');
            req.loginUser.userData = userData?.user;
            next();
        } else {
            throw new Error("token_invalid");
        }
    } catch (e) {
        console.error('Error token =---->>  ', e);
        let keyword = 'token_invalid';

        if (e.message == 'user_inactive_by_admin') {
            keyword = 'user_inactive_by_admin'
        } else if (e.message == 'user_blocked_by_admin') {
            keyword = 'user_blocked_by_admin'
        } else if (e.message == 'user_account_delete') {
            keyword = 'user_account_delete'
        } else if (e.message == 'token_expired') {
            keyword = 'token_expired'
        } else if (e.message == 'token_missing') {
            keyword = 'token_missing'
        }
        sendResponse(req, res, 401, 'error', { keyword: keyword, components: {} }, {});
    }
}

const checkBodyInline = (rules) => {
    // JOI validation commen
    return (req, res, next) => {
        const schema = rules.messages({
            'any.required': getMessage(req?.headers?.['accept-language'], 'validation.required', { label: '{#label}' }),
            'string.empty': getMessage(req?.headers?.['accept-language'], 'validation.empty', { label: '{#label}' }),
            'string.max': getMessage(req?.headers?.['accept-language'], 'validation.max', { label: '{#label}', max: '{#limit}' }),
            'string.min': getMessage(req?.headers?.['accept-language'], 'validation.min', { label: '{#label}', min: '{#limit}' }),
            'number.max': getMessage(req?.headers?.['accept-language'], 'number.validation.max', { label: '{#label}', max: '{#limit}' }),
            'number.min': getMessage(req?.headers?.['accept-language'], 'number.validation.min', { label: '{#label}', min: '{#limit}' }),
        });
        const validationData = req?.files ? { ...req?.body, ...req?.files } : req.body;
        const { error } = schema.validate(validationData, { abortEarly: true });
        if (error) {
            const errorMessage = error?.details?.[0]?.message?.replace(/\"/g, '')?.replace(/_/g, ' ');
            console.log('Error:', errorMessage);
            return res.status(201).json({ status: 'error', message: errorMessage, });
        }
        next();
    };
}

// Function to return response for any api
const sendResponse = function (req, res, statuscode, responseStatus, { keyword, components }, responsedata, responseCode = null) {

    let formatmsg = getMessage(req.headers['accept-language'], keyword, components);
    let encrypted_data = ''
    if (responseCode != null) {
        encrypted_data = { code: responseCode, status: responseStatus, message: formatmsg, data: responsedata };
    } else {
        encrypted_data = { status: responseStatus, message: formatmsg, data: responsedata };
    }
    res.status(statuscode);
    res.send(encrypted_data);
}

const checkBodyInlineForAdmin = (rules, redirectPath) => {
    return (req, res, next) => {
        const schema = rules.messages({
            'any.required': getMessage(req?.headers?.['accept-language'], 'validation.required', { label: '{#label}' }),
            'string.empty': getMessage(req?.headers?.['accept-language'], 'validation.empty', { label: '{#label}' }),
            'string.max': getMessage(req?.headers?.['accept-language'], 'validation.max', { label: '{#label}', max: '{#limit}' }),
            'string.min': getMessage(req?.headers?.['accept-language'], 'validation.min', { label: '{#label}', min: '{#limit}' }),
            'number.max': getMessage(req?.headers?.['accept-language'], 'number.validation.max', { label: '{#label}', max: '{#limit}' }),
            'number.min': getMessage(req?.headers?.['accept-language'], 'number.validation.min', { label: '{#label}', min: '{#limit}' }),
        });
        const validationData = req?.files ? { ...req?.body, ...req?.files } : req.body;
        const { error } = schema.validate(validationData, { abortEarly: true });
        if (error) {
            const errorMessage = error?.details?.[0]?.message?.replace(/\"/g, '')?.replace(/_/g, ' ');
            console.error('Error:', errorMessage);
            req.flash('error', errorMessage);
            console.log('rules, redirectPath :', redirectPath);
            return res.redirect(redirectPath);
        } else {
            next();
        }
    };
}

// Function to return response for any api
const sendPageResponse = function (req, res, statuscode, responseStatus, message, redirectPage = null, responsedata = null) {
    if (responseStatus && message) {
        req.flash(responseStatus, message);
    }
    if (responsedata && redirectPage) {
        res.render(redirectPage, responsedata);
    } else if (redirectPage) {
        res.redirect(redirectPage);
    }
}

// Function to send users language from any place
const getMessage = function (requestLanguage = 'en', key, value) {
    try {
        localizify.add('en', en).setLocale(requestLanguage);
        let message = t(key, value);
        return message;
    } catch (e) {
        return "Oops! Something went wrong";
    }
}

module.exports = {
    checkApiKey,
    checkToken,
    sendResponse,
    sendPageResponse,
    checkBodyInline,
    checkBodyInlineForAdmin,
};
