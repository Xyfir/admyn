const mysql = require('lib/mysql-wrap');

/*
  POST databases/:db/tables/:t/rows
  REQUIRED
    data: { field: value }
  RETURN
    {
      affectedRows: number, changedRows: number, fieldCount: number,
      insertId: number, message: string, serverStatus: number,
      warningCount: number
    }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.expressql.database, {
        database: req.params.db
      })
    );
    const result = await db.query(
      `INSERT INTO \`${req.params.t}\` SET ?`,
      req.body.data
    );
    db.close();
  
    res.json(result);
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}