require('app-module-path').addPath(__dirname);

const assert = require('assert');
const mysql = require('lib/mysql-wrap');

// Config object that would normally be passed to admyn/server
const admyn = {
  // Update these values to work in the environment you want to test
  // User should have all privileges for tests to work
  database: {
    port: 3306,
    user: 'root',
    host: 'localhost',
    password: ''
  }
};

/**
 * Wraps a controller and resolves or rejects with the controller's response.
 * @async
 * @param {string} path
 * @param {object} req
 * @return {Promise}
 */
function wrap(path, req) {
  const controller = require('controllers/' + path);
  req.admyn = admyn;

  return new Promise((resolve, reject) =>
    controller(req, {
      json: data => resolve(data),
      status: code => {
        if (code == 200)
          return { json: data => resolve(data) };
        else
          return { json: data => reject(data) };
      }
    })
  );
}

(async function() {

  const db = new mysql;
  db.connect(admyn.database);

  let res, actual, expected;

  // Create test database
  await db.query('DROP DATABASE IF EXISTS `_admyn_test_database_`');
  await db.query('CREATE DATABASE `_admyn_test_database_`');

  // Query databases and check for _admyn_test_database_
  res = await wrap('databases/list', {}),
  assert(
    !!res.find(d => d == '_admyn_test_database_'),
    'controllers/databases/list'
  );

  // Switch to database
  db.close();
  admyn.database.database = '_admyn_test_database_';
  db.connect(admyn.database);

  // Create test table
  await db.query(`
    CREATE TABLE \`users\` (
      \`user_id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
      \`xyfir_id\` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
      \`email\` varchar(64) NOT NULL,
      \`subscription\` bigint(13) unsigned NOT NULL,
      \`trial\` tinyint(1) NOT NULL DEFAULT '1',
      PRIMARY KEY (\`user_id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8
  `);
  
  // Query tables in database and check for table
  res = await wrap('databases/tables/list', {
    params: { db: '_admyn_test_database_' }
  });
  assert(
    res.length == 1 && res[0] == 'users',
    'controllers/databases/tables/list'
  );

  // Query structure of table1
  actual = await wrap('databases/tables/structure', {
    params: { db: '_admyn_test_database_', t: 'users' }
  }),
  expected = [{
    Field: 'user_id', Type: 'int(10) unsigned', Null: 'NO', Key: 'PRI',
    Default: null, Extra: 'auto_increment'
  }, {
    Field: 'xyfir_id', Type: 'varchar(64)', Null: 'NO', Key: '',
    Default: null, Extra: ''
  }, {
    Field: 'email', Type: 'varchar(64)', Null: 'NO', Key: '',
    Default: null, Extra: ''
  }, {
    Field: 'subscription', Type: 'bigint(13) unsigned', Null: 'NO', Key: '',
    Default: null, Extra: ''
  }, {
    Field: 'trial', Type: 'tinyint(1)', Null: 'NO', Key: '',
    Default: '1', Extra: ''
  }];
  assert.deepEqual(actual, expected, 'controllers/databases/tables/structure');

  // Insert row into table
  actual = await wrap('databases/tables/rows/insert', {
    params: {
      db: '_admyn_test_database_', t: 'users'
    },
    body: {
      data: {
        user_id: 1, xyfir_id: 'test', email: 'test@domain.com',
        subscription: 1494454357596, trial: true
      }
    }
  }),
  expected = {
    fieldCount: 0, affectedRows: 1, insertId: 1, serverStatus: 2,
    warningCount: 0, message: '', protocol41: true, changedRows: 0
  };
  assert.deepEqual(
    actual, expected, 'controllers/databases/tables/rows/insert'
  );

  // Query rows in table and check for row
  actual = await wrap('databases/tables/rows/find', {
    params: {
      db: '_admyn_test_database_', t: 'users'
    },
    query: {
      columns: '*', orderBy: 'user_id', ascending: 'true',
      limit: 1, page: 1,
      search: JSON.stringify([{
        column: 'user_id', query: 1, type: 'exact'
      }, {
        column: 'xyfir_id', query: '%test%', type: 'like'
      }, {
        column: 'email', query: '.+\@domain\.com', type: 'regexp'
      }])
    }
  }),
  expected = [{
    user_id: 1, xyfir_id: 'test', email: 'test@domain.com',
    subscription: 1494454357596, trial: 1
  }];
  assert.deepEqual(
    actual, expected, 'controllers/databases/tables/rows/find'
  );

  // Edit row in table
  actual = await wrap('databases/tables/rows/edit', {
    params: {
      db: '_admyn_test_database_', t: 'users'
    },
    body: {
      set: {
        xyfir_id: 'updated', trial: 0
      },
      where: {
        user_id: 1, xyfir_id: 'test'
      }
    }
  }),
  expected = {
    fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
    message: '(Rows matched: 1  Changed: 1  Warnings: 0',
    warningCount: 0, protocol41: true, changedRows: 1
  };
  assert.deepEqual(
    actual, expected, 'controllers/databases/tables/rows/edit'
  );

  // Delete row in table
  actual = await wrap('databases/tables/rows/delete', {
    params: {
      db: '_admyn_test_database_', t: 'users'
    },
    body: {
      where: {
        user_id: 1, xyfir_id: 'updated'
      }
    }
  }),
  expected = {
    fieldCount: 0, affectedRows: 1, insertId: 0, serverStatus: 2,
    message: '', warningCount: 0, protocol41: true, changedRows: 0
  };
  assert.deepEqual(
    actual, expected, 'controllers/databases/tables/rows/delete'
  );

  // Delete database
  await db.query('DROP DATABASE `_admyn_test_database_`');

  console.log('Tests complete');
  process.exit(0);

})();