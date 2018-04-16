const mysql = require('../../lib/mysql-wrap');

/*
  POST databases/:db/query
  REQUIRED
    query: string
  RETURN
    object[] // the rows or results from the query
*/
module.exports = async function(req, res) {
  const db = new mysql();

  try {
    db.connect(
      Object.assign({}, req.admyn.database, { database: req.params.db })
    );
    const result = await db.query(req.body.query);
    db.close();

    res.json(Array.isArray(result) ? result : [result]);
  } catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }
};
