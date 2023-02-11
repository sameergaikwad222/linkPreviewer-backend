const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
  transports: [
    new transports.File({ filename: "combined_error.log", level: "error" }),
    new transports.File({ filename: "combined_info.log", level: "info" }),
  ],
});

module.exports = logger;
