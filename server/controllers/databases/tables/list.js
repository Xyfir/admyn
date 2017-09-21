const mysql = require('lib/mysql-wrap');

/*
  GET databases/:db/tables
  RETURN
    string[] // names of tables
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.admyn.database, {
        database: req.params.db
      })
    );
    const rows = await db.query('SHOW TABLES');
    db.close();

    res.json(rows.map(r => r['Tables_in_' + req.params.db]));
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}