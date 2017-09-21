const mysql = require('lib/mysql-wrap');

/*
  GET databases/:db/tables/:t/structure
  RETURN
    [{
      Default: null|string, Extra: string, Field: string, Key: string,
      Null: string, Type: string
    }]
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.admyn.database, {
        database: req.params.db
      })
    );
    const rows = await db.query(`DESCRIBE \`${req.params.t}\``);
    db.close();

    res.json(rows);
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}