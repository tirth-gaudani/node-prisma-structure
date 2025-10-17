require("dotenv").config();
require("./utils/instrument");
const Sentry = require("@sentry/node");
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
const cors = require('cors');
const { createDoc } = require('node-api-document');
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const apiDoc = require('./api-doc');
const apiPath = require('./modules/v1/api');
const app = express();

const allowedReferrers = [
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedReferrers.includes(origin)) {
            callback(null, true);
        } else {
            console.error('CORS error: Origin not allowed:', origin); // Log the error for debugging
            callback(new Error(`CORS error: Origin ${origin} is not allowed`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use((err, req, res, next) => {
    if (err instanceof Error && err.message.startsWith('CORS error')) {
        res.status(403).json({ message: err.message });
    } else {
        next(err);
    }
});

app.use(compression());

app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 80, // Limit each user to 80 requests per windowMs
    keyGenerator: (req) => {
        let token;
        if (!req?.loginUser?.token) {
            let tokenFetched = req.header('Authorization');
            token = tokenFetched?.replace('Bearer ', '');
        }
        return req.headers['z-user-ip'] || req?.loginUser?.token || token || ipKeyGenerator(req);
    },
    message: { code: 429, status: "error", message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
}));

app.use(bodyParser.json({ limit: '35mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/v1/', apiPath);

createDoc(app, 'api-key, token, accept-language, z-user-ip', apiDoc);

// 🛑 Capture unhandled errors globally
Sentry.setupExpressErrorHandler(app);

app.use(function onError(err, req, res, next) {
    console.error("Error =-->   ", err);
    console.error("Sentry Error =--->>  ", res.sentry + "\n");
    res.status(500).json({ status: "error", message: "Something went wrong!" });
});

// 404 handler
app.use("/", (req, res) => {
    res.status(404).json({ status: "error", message: '404 Not Found' });
});

const PORT = process.env.PORT || 3000;

try {
    app.use(express.static('public'));
    server = app.listen(PORT, () => {
        console.log(`😈 Worker ${process.pid}\x1b[33m App Running \x1b[0m\x1b[37m\x1b[1m⚡\x1b[33mOn 🔥 \x1b[4m\x1b[36m\x1b[1m` + PORT + `\x1b[0m 🔥`);
    });
} catch (error) {
    console.log('error in server =---->>  ', error);
}