/**
 * Creates Express router for the admin panel route.
 * @param {object} [options] - Currently unused and can be ignored.
 * @return {Express.Router}
 */
module.exports = function(options) {

  const router = require('express').Router();

  /* DATABASES */
  router.get(
    '/databases',
    require('./controllers/databases/list')
  );
  router.post(
    '/databases/:db/query',
    require('./controllers/databases/custom-query')
  );

  /* DATABASES > TABLES */
  router.get(
    '/databases/:db/tables',
    require('./controllers/databases/tables/list')
  );
  router.get(
    '/databases/:db/tables/:t/structure',
    require('./controllers/databases/tables/structure')
  );

  /* DATABASES > TABLES > ROWS */
  router.get(
    '/databases/:db/tables/:t/rows',
    require('./controllers/databases/tables/rows/find')
  );
  router.put(
    '/databases/:db/tables/:t/rows',
    require('./controllers/databases/tables/rows/edit')
  );
  router.post(
    '/databases/:db/tables/:t/rows',
    require('./controllers/databases/tables/rows/insert')
  );
  router.delete(
    '/databases/:db/tables/:t/rows',
    require('./controllers/databases/tables/rows/delete')
  );

  return router;

}