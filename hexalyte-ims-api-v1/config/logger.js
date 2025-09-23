const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Ensure log directories exist to prevent File transport errors
const errorDir = path.join(process.cwd(), 'logs', 'error');
const activityDir = path.join(process.cwd(), 'logs', 'activity');
try {
    fs.mkdirSync(errorDir, { recursive: true });
    fs.mkdirSync(activityDir, { recursive: true });
} catch (err) {
    // Fallback to console-only if directory creation fails
    console.warn('Failed to create log directories:', err.message);
}

const logConfiguration = {

    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(errorDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(activityDir, 'activity.log'), level: 'info' })
    ],
};

const logger = winston.createLogger(logConfiguration);



module.exports = logger;