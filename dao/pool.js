var mysql = require('mysql'),
    conf = require('../config/mysql');

module.exports = mysql.createPool(conf);