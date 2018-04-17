import { Toolbar, ListItem, Drawer, Button } from 'react-md';
import request from 'superagent';
import React from 'react';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.views = {
      ROOT: 0,
      DATABASES: 1,
      TABLES: 2
    };

    this.state = {
      url: location.hash.substr(2).split('/'),
      view: this.views.ROOT,
      drawer: false,
      /**
       * The name of the database being viewed
       * @type {string}
       */
      database: null,
      /** @type {object[]} */
      databases: []
    };
  }

  /** @param {MouseEvent} e */
  onDrawerBack(e) {
    e.stopPropagation();

    const { views } = this;

    switch (this.state.view) {
      case views.ROOT:
        return this.setState({ drawer: false });
      case views.DATABASES:
        return this.setState({ view: views.ROOT });
      case views.TABLES:
        return this.setState({ view: views.DATABASES, database: null });
    }
  }

  /** @param {MouseEvent} e */
  onLoadDatabases(e) {
    e.stopPropagation();

    request.get(this.props.api + 'databases').end(
      (err, res) =>
        !err &&
        this.setState({
          view: this.views.DATABASES,
          databases: res.body.map(db => Object({ name: db, tables: [] }))
        })
    );
  }

  /**
   * @param {MouseEvent} e
   * @param {string} db
   */
  onLoadTables(e, db) {
    e.stopPropagation();

    const databases = this.state.databases.slice();
    const i = databases.findIndex(_db => _db.name == db);

    if (databases[i].tables.length) return;

    request.get(`${this.props.api}databases/${db}/tables`).end((err, res) => {
      if (err) return;

      databases[i].tables = res.body;
      this.setState({ databases, database: db, view: this.views.TABLES });
    });
  }

  /** @return {JSX.Element[]} */
  _renderNavItems() {
    const { database, databases } = this.state;
    const { views } = this;

    switch (this.state.view) {
      case views.ROOT:
        return [
          <ListItem
            key={views.DATABASES}
            onClick={e => this.onLoadDatabases(e)}
            primaryText="Databases"
          />
        ];
      case views.DATABASES:
        return databases.map(db => (
          <ListItem
            key={db.name}
            onClick={e => this.onLoadTables(e, db.name)}
            primaryText={db.name}
          />
        ));
      case views.TABLES:
        return databases
          .find(db => db.name == database)
          .tables.map(tbl => (
            <ListItem
              key={tbl}
              onClick={() =>
                (location.hash = `#/databases/${database}/tables/${tbl}/rows`)
              }
              primaryText={tbl}
            />
          ));
    }
  }

  render() {
    const { drawer } = this.state;

    return (
      <React.Fragment>
        <Toolbar
          colored
          actions={[
            <Button
              icon
              iconChildren="home"
              onClick={() => (location.hash = '#/')}
            />
          ]}
          title={this.props.title}
          nav={
            <Button
              icon
              iconChildren="menu"
              onClick={() => !this.setState({ drawer: true })}
            />
          }
        />

        <Drawer
          onVisibilityChange={v => this.setState({ drawer: v })}
          autoclose={true}
          navItems={this._renderNavItems()}
          visible={drawer}
          header={
            <Toolbar
              colored
              nav={
                <Button
                  icon
                  onClick={e => this.onDrawerBack(e)}
                  iconChildren="arrow_back"
                />
              }
            />
          }
          type={Drawer.DrawerTypes.TEMPORARY}
        />
      </React.Fragment>
    );
  }
}
