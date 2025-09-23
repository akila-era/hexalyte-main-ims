const dotenv = require('dotenv')
// Load environment from process env (Docker) or fallback to .env if present
dotenv.config()
const express = require('express')
const app = express()
const routeManager = require('./route/route.manager.js')
const db = require("./models/index");
const cors = require('cors')
const swaggerDocs = require('./swagger.js')
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const helmet = require('helmet');
const morgan = require("morgan");
const cookieParser = require("cookie-parser")
//const xss = require('xss-clean');
// const querystring = require('querystring');
// var URLSearchParams = require('url-search-params');

const fs = require('fs')
const https = require('https')

const PORT = process.env.APP_PORT || process.env.PORT || 5555


// set security HTTP headers
app.use(helmet());
// app.use(xss());
// app.use(querystring());
// app.use(URLSearchParams());
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended:true }))
app.use(cors({
    // origin: 'https://vims.hexalyte.com',
    // origin: 'http://localhost:3000',
    origin: ['http://194.163.175.47', 'http://194.163.175.47:3000', 'http://localhost:3000'],
    credentials: true
}));

// Your regular express app setup
// ...

// SSL options
// const options = {
//     cert: fs.readFileSync('/etc/letsencrypt/live/vims.hexalyte.com/fullchain.pem'),
//     key: fs.readFileSync('/etc/letsencrypt/live/vims.hexalyte.com/privkey.pem')
//   };
  
//   // Create HTTPS server
//   https.createServer(options, app).listen(443, () => {
//     console.log('HTTPS server running on port 443');
//   });
  
//   // Optional: Also keep the HTTP server running and redirect to HTTPS
//   const http = require('http');
//   http.createServer((req, res) => {
//     res.writeHead(301, { 'Location': 'https://' + req.headers.host + req.url });
//     res.end();
//   }).listen(80);

db.sequelize.sync()
    .then(() => {
        console.log("sync db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

routeManager(app)
swaggerDocs(app, PORT)

// error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).json({
        status: 'fail',
        code: 500,
        error: `Can't find ${err.stack}`
    });
});

// 404 handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: 'fail',
        code: 404,
        error: `Can't find ${req.originalUrl}`
    });
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason', reason )
})

app.listen(PORT, () => {
    console.log(`:::::::::::::::: SERVER RUNNING ON ${PORT}.`);
});