module.exports = {
    'APP_NAME': process.env.APP_NAME,
    'LOGO_URL': process.env.LOGO_URL,
    'FRONT_BASE_URL': process.env.FRONT_BASE_URL,
    'BASE_URL': process.env.BASE_URL,

    'BASE_URL_WITHOUT_API_DOC':process.env.BASE_URL+'v1/',

    'ADMIN_BASE_URL':process.env.BASE_URL+'admin/',


    'EMAIL_SERVICE': process.env.EMAIL_SERVICE || 'gmail',
    'EMAIL_PORT': process.env.EMAIL_PORT || 587,
    'EMAIL_SECURE': process.env.EMAIL_SECURE || false,
    'EMAIL': process.env.EMAIL,
    'PASSWORD': process.env.PASSWORD,

    // Email template theme change
    'EMAIL_BACKGROUND_COLOR': process.env.EMAIL_BACKGROUND_COLOR,
    'EMAIL_CARD_BACKGROUND_COLOR': process.env.EMAIL_CARD_BACKGROUND_COLOR,
    'EMAIL_FONT_FAMILY': process.env.EMAIL_FONT_FAMILY,
    'EMAIL_TEXT_COLOR': process.env.EMAIL_TEXT_COLOR,
    'EMAIL_BUTTON_BACKGROUND_COLOR_IN_ENV': process.env.EMAIL_BUTTON_BACKGROUND_COLOR,
    'EMAIL_BUTTON_TEXT_COLOR_IN_ENV': process.env.EMAIL_BUTTON_TEXT_COLOR,

};
