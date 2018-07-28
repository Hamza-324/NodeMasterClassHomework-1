/*
 *Create and export configuration variables
 *
 */

var environments = {}

environments.staging = {
    'httpPort': 3000,
    'envName': 'staging'
}


environments.production = {
    'httpPort': 5000,
    'envName': 'production'
}

//Determine which one should be exported out
let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Validate if current enviornment exists at all
let enviornmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments['staging']

module.exports = enviornmentToExport