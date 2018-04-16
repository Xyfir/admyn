const mysql = require('../../lib/mysql-wrap');

/*
  GET databases
  RETURN
    string[] // names of databases
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    db.connect(Object.assign({}, req.admyn.database, { database: '' }));
    const rows = await db.query('SHOW DATABASES');
    db.close();

    res.json(rows.map(r => r.Database));
  } catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }
};
