const mysql = require('lib/mysql');

/*
  GET databases/:db/tables/:t/rows
  REQUIRED
    columns: string|string[], orderBy: string, ascending: boolean,
    limit: number, page: number
  OPTIONAL
    search: [{
      column: string, query: string|number, type: 'exact|like|regexp'
    }]
  RETURN
    object[]
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.expressql.database, {
        database: req.params.db
      })
    );

    const { query: q } = req;

    const sql = `
      SELECT
        ${q.columns == '*' ? '*' : q.columns.map(c => `\`${c}\``).join(', ')}
      FROM
        \`${req.params.t}\`
      WHERE
        ${q.search ? buildSearch(q.search) : '1 = 1'}
      ORDER BY
        \`${q.orderBy}\` ${q.ascending ? 'ASC' : 'DESC'}
      LIMIT
        ${q.limit * (q.page - 1)},${q.limit * q.page}
    `,
    vars = (req.query.search || []).map(s => s.query),
    rows = await db.query(sql, vars);
    db.close();
  
    res.json(rows);
  }
  catch (err) {
    db.close();
    res.status(400).json({ error: err });
  }

}

/**
 * Using query.search, build data for the WHERE portion of query.
 * @param {object[]} search
 * @return {string}
 */
function buildSearch(search) {
  return search
    .map(s => {
      let t = `\`${s.column}\` `;

      if (s.type == 'exact')
        t += '= ?';
      else if (s.type == 'like')
        t += `LIKE ?`;
      else
        t += 'REGEXP ?';

      return t;
    })
    .join(' AND ');
}