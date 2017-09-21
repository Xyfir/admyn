const mysql = require('lib/mysql-wrap');

/*
  GET databases/:db/tables/:t/rows
  REQUIRED
    columns: string, orderBy: string, ascending: boolean,
    limit: number, page: number
  OPTIONAL
    search: json([{
      column: string, query: string|number, type: 'exact|like|regexp'
    }])
  RETURN
    object[]
*/
module.exports = async function(req, res) {

  const db = new mysql;

  try {
    db.connect(
      Object.assign({}, req.admyn.database, {
        database: req.params.db
      })
    );

    const { query: q } = req;

    if (q.search) q.search = JSON.parse(q.search);
    q.ascending = q.ascending == 'true';

    const sql = `
      SELECT
        ${q.columns == '*'
          ? '*'
          : q.columns.split(',').map(c => `\`${c}\``).join(', ')
        }
      FROM
        \`${req.params.t}\`
      WHERE
        ${q.search ? buildSearch(q.search) : '1 = 1'}
      ORDER BY
        \`${q.orderBy}\` ${q.ascending ? 'ASC' : 'DESC'}
      LIMIT
        ${q.limit * (q.page - 1)},${q.limit * q.page}
    `,
    vars = (q.search || []).map(s => s.query),
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