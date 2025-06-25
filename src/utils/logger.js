const path = require('path');
const fs = require('fs');

function getTimestamp() {
  return new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
}

function getDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function getCallerFile() {
    const originalFunc = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack;
  
    Error.prepareStackTrace = originalFunc;
  
    for (let i = 0; i < stack.length; i++) {
      const file = stack[i].getFileName();
      if (file && !file.includes('logger.js')) {
        return path.basename(file);
      }
    }
  
    return 'unknown';
}

function logToFile(level, message) {
  const logDir = path.join(__dirname, '../../logs');
  const dateStr = getDateString();
  const logPath = path.join(logDir, `diangx-${dateStr}.log`);

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logLine = `[${getTimestamp()}] [${level.toUpperCase()}] [${getCallerFile()}] ${message}\n`;
  fs.appendFileSync(logPath, logLine);
}

function log(level, message) {
  const line = `[${getTimestamp()}] [${level.toUpperCase()}] [${getCallerFile()}] ${message}`;
  console.log(line);
  logToFile(level, message);
}

module.exports = {
  info: msg => log('info', msg),
  error: msg => log('error', msg),
};
