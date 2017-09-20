const mysql = require('lib/mysql-wrap');

/*
  PUT databases/:db/tables/:t/rows
  REQUIRED
    set: { field: value }
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
      Object.assign({}, req.expressql.database, {
        database: req.params.db
      })
    );

    const sql = `UPDATE \`${req.params.t}\` SET ${
      Object.keys(req.body.set).map(k => `\`${k}\` = ?`).join(', ')
    } WHERE ${
      Object.keys(req.body.where).map(k => `\`${k}\` = ?`).join(' AND ')
    }`,
    vars = [].concat(
      Object.keys(req.body.set).map(k => req.body.set[k]),
      Object.keys(req.body.where).map(k => req.body.where[k])
    ),
    result = await db.query(sql, vars);
    db.close();
  
    res.json(result);
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}