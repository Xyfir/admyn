const mysql = require('mysql');

/**
 * @typedef {object} MySQLConnectOptions
 * @prop {string} [host=localhost]
 * @prop {string} [user=root]
 * @prop {number} [port=3306]
 * @prop {string} [password]
 * @prop {string} [database]
 */

/**
 * Wraps mysql package and uses promises in place of callbacks.
 */
class MySQL {
  /**
   * Create connection to database.
   * @param {MySQLConnectOptions} options
   */
  connect(options) {
    this.cn = mysql.createConnection({
      port: options.port || 3306,
      host: options.host || 'localhost',
      user: options.user || 'root',
      password: options.password || '',
      database: options.database || ''
    });
  }

  /**
   * Sends query to database.
   * @param {string} [sql] - SQL query string
   * @param {any[]|object} [vars] - Variables to insert at '?' in sql
   * @async
   * @return {object[]}
   */
  query(sql = '', vars = []) {
    return new Promise((resolve, reject) =>
      this.cn.query(sql, vars, (err, res) => (err ? reject(err) : resolve(res)))
    );
  }

  /**
   * Closes the database connection.
   */
  close() {
    this.cn && this.cn.end();
    this.cn = null;
  }
}

module.exports = MySQL;
