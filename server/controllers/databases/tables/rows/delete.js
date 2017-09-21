const mysql = require('lib/mysql-wrap');

/*
  DELETE databases/:db/tables/:t/rows
  REQUIRED
    where: { field: value }
  RETURN
    {
      affectedRows: number, changedRows: number, fieldCount: number,
      message: string, serverStatus: number, warningCount: number
    }
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.admyn.database, {
        database: req.params.db
      })
    );
    const result = await db.query(
      `DELETE FROM \`${req.params.t}\` WHERE ` +
      Object.keys(req.body.where).map(k => `\`${k}\` = ?`).join(' AND'),
      Object.keys(req.body.where).map(k => req.body.where[k])
    );
    db.close();
  
    res.json(result);
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}