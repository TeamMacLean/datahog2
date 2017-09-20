const Log = {};


/**
 * Log default
 * @param inputs
 */
Log.log = (...inputs) => {
    console.log(inputs.join(' '));
};

/**
 * Log error
 * @param inputs
 */
Log.error = (...inputs) => {
    console.log(inputs.join(' '));
};

/**
 * Log success
 * @param inputs
 */
Log.success = (...inputs) => {
    console.log(inputs.join(' '));
};

/**
 * Log warning
 * @param inputs
 */
Log.warn = (...inputs) => {
    console.log(inputs.join(' '));
};

module.exports = Log;