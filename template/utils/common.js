const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const { EMAIL_SERVICE, EMAIL_PORT, EMAIL_SECURE, EMAIL, PASSWORD } = require('../config/constants');

const common = {

    jwt_validate: async (token) => {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

            if (verified) {
                return verified;
            } else {
                throw new Error("token_invalid");
            }
        } catch (error) {
            // Access Denied 
            throw new Error("token_invalid");
        }
    },

    jwt_sign: (user_id, user_type, expiresIn = "30days") => {
        const enc_data = {
            expiresIn,
            data: { user_id, user_type }
        }

        const token = jwt.sign(enc_data, process.env.JWT_SECRET_KEY);
        // console.log('token', token)
        return token;
    },

    sendEmail: (to_mail, subject, message) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({
                service: EMAIL_SERVICE,
                port: EMAIL_PORT,
                secure: EMAIL_SECURE,
                auth: {
                    user: EMAIL,
                    pass: PASSWORD,
                },
            });

            let mailOptions = {
                from: EMAIL,
                to: to_mail,
                subject: subject,
                html: message
            };

            transporter.sendMail(mailOptions, function (error, info) {
                console.log('Mail Send info :---->>    ', { accepted: info?.accepted, rejected: info?.rejected, response: info?.response, envelope: info?.envelope });
                if (!error) {
                    resolve(true);
                } else {
                    console.log('error In mail send -=-=-=---->>>    ', error);
                    resolve(false);
                }
            });

        });
    },

    generateRandomNumericString: async (length) => {
        let result = '';
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    },

}

module.exports = common