const { EMAIL_BUTTON_BACKGROUND_COLOR, EMAIL_BUTTON_TEXT_COLOR, TEXT_COLOR, BACKGROUND_COLOR, CARD_BACKGROUND_COLOR, FONT_FAMILY } = require('./nyu_auth.template_colors.json');
const { FRONT_BASE_URL, LOGO_URL, APP_NAME, EMAIL_BACKGROUND_COLOR, EMAIL_CARD_BACKGROUND_COLOR, EMAIL_FONT_FAMILY, EMAIL_TEXT_COLOR, EMAIL_BUTTON_BACKGROUND_COLOR_IN_ENV, EMAIL_BUTTON_TEXT_COLOR_IN_ENV, } = require("../../config/nyu_auth.constants");

module.exports = function (data, isNew) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>${APP_NAME} email verification</title>
    <meta name="description" content="${APP_NAME} email verification">
</head>

<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="margin: 0pt auto; padding: 0px; background:${EMAIL_BACKGROUND_COLOR || BACKGROUND_COLOR};">
    <table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL_BACKGROUND_COLOR || BACKGROUND_COLOR}">
        <tbody>
            <tr>
                <td valign="top">
                    <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0" bgcolor="${EMAIL_BACKGROUND_COLOR || BACKGROUND_COLOR}" align="center" style="margin:0 auto; table-layout: fixed;">
                        <tbody>
                            <tr>
                                <td colspan="4">
                                    <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td colspan="2" height="30"></td>
                                            </tr>
                                            <tr>
                                                <td valign="top" align="center">
                                                    <a href="${FRONT_BASE_URL}" style="display:inline-block; cursor:pointer; text-align:center;"></a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" height="30"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL_CARD_BACKGROUND_COLOR || CARD_BACKGROUND_COLOR}" style="border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                                        <tbody>
                                            <tr>
                                                <td height="40"></td>
                                            </tr>
                                            <tr style="font-family: ${EMAIL_FONT_FAMILY || FONT_FAMILY}; color:${EMAIL_TEXT_COLOR || TEXT_COLOR}; font-size:14px; line-height:20px; margin-top:20px;">
                                                <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${EMAIL_CARD_BACKGROUND_COLOR || CARD_BACKGROUND_COLOR}">
                                                        <tbody>
                                                            <tr>
                                                                <td align="center" valign="bottom" colspan="2" cellpadding="3">
                                                                    <img alt="${APP_NAME} logo" width="80" src="${LOGO_URL}" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="30" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center"> <span style="color:${EMAIL_TEXT_COLOR || TEXT_COLOR};font-size:22px;line-height: 24px;">${isNew?"Verify your email address":"Reset your password"}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="24" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td height="1" bgcolor="#DAE1E9"></td>
                                                            </tr>
                                                            <tr>
                                                                <td height="24" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center"> <span style="color:${EMAIL_TEXT_COLOR || TEXT_COLOR};font-size:14px;line-height:24px;">${isNew?`In order to start using your ${APP_NAME} account, you need to confirm your email address.`:`To start using your ${APP_NAME} account, please reset your password by clicking the button below:`}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="20" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td valign="top" width="48%" align="center"> <span><a href="${data?.verify_link}" style="display:block; padding:15px 25px; background-color:${EMAIL_BUTTON_BACKGROUND_COLOR_IN_ENV || EMAIL_BUTTON_BACKGROUND_COLOR}; color:${EMAIL_BUTTON_TEXT_COLOR_IN_ENV || EMAIL_BUTTON_TEXT_COLOR}; border-radius:3px; text-decoration:none;">${isNew?`Verify Email Address`:`Reset Password`}</a></span>

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="20" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="https://s3.amazonaws.com/app-public/Coinbase-notification/hr.png" width="54" height="2" border="0">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height="20" &nbsp;=""></td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <p style="color:${EMAIL_TEXT_COLOR || TEXT_COLOR}; font-size:12px; line-height:17px; font-style:italic;opacity:0.7;">${isNew?`If you did not sign up for this account you can ignore this email.`:`If you did not request a password reset, please ignore this message.`}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="60"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td height="10">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td valign="top" align="center"> <span style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#9EB0C9; font-size:10px;">&copy;<a href="https://www.coinbase.com/" target="_blank" style="color:#9EB0C9 !important; text-decoration:none;">${APP_NAME}</a></span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="50">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;
}