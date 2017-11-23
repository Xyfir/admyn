import { Toolbar, ListItem, Drawer, Button } from 'react-md';
import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// Components
import Databases from './databases/Databases';

export default class AdmynPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      url: location.hash.substr(2).split('/'),
      drawer: false,
      databases: [/*{
        name: string, tables: string[], expand: boolean
      }*/]
    };

    window.onhashchange = () => {
      const url = location.hash.substr(2).split('/');

      if (
        (this.state.url[1] && url[1] && this.state.url[1] != url[1]) ||
        (this.state.url[3] && url[3] && this.state.url[3] != url[3])
      )
        location.reload();
      else
        this.setState({ url  });
    }
  }

  onLoadDatabases() {
    if (this.state.databases.length) return;

    request
      .get(this.props.api + 'databases')
      .end((err, res) => !err &&
        this.setState({
          databases: res.body.map(db => Object({ name: db, tables: [] }))
        })
      );
  }

  /** @param {string} db */
  onLoadTables(db) {
    const databases = this.state.databases.slice();
    const i = databases.findIndex(_db => _db.name == db);

    if (databases[i].expand) {
      // ** FIX: For some reason this causes an error, likely from react-md
      // databases[i].expand = false;
      return this.setState({ databases });
    }

    if (databases[i].tables.length) return;

    request
      .get(`${this.props.api}databases/${db}/tables`)
      .end((err, res) => {
        if (err) return;

        databases[i].tables = res.body,
        databases[i].expand = true;

        this.setState({ databases });
      });
  }

  render() {
    const view = (() => {
      const props = { url: this.state.url, api: this.props.api };

      // Currently the only top-level component/section
      return <Databases {...props} />
    })();
    
    return (
      <div className='admyn'>
        <Toolbar
          colored
          actions={[
            <Button
              icon
              iconChildren='home'
              onClick={() => location.hash = '#/databases'}
            />
          ]}
          title={this.props.title}
          nav={
            <Button
              icon
              iconChildren='menu'
              onClick={() =>
                !this.setState({ drawer: true }) &&
                this.onLoadDatabases()
              }
            />
          }
        />

        <Drawer
          onVisibilityChange={v => this.setState({ drawer: v })}
          autoclose={true}
          navItems={
            this.state.databases.map(db =>
              <ListItem
                key={db.name}
                visible={db.expand}
                onClick={e => this.onLoadTables(db.name)}
                primaryText={db.name}
                nestedItems={
                  db.tables.map(tbl =>
                    <ListItem
                      key={tbl}
                      onClick={() => location.hash =
                        `#/databases/${db.name}/tables/${tbl}/rows`
                      }
                      primaryText={tbl}
                    />
                  )
                }
              />
            )
          }
          visible={this.state.drawer}
          type={Drawer.DrawerTypes.TEMPORARY}
        />

        {view}
      </div>
    );
  }

}

AdmynPanel.propTypes = {
  title: PropTypes.string,
  api: PropTypes.string
},

AdmynPanel.defaultProps = {
  title: 'Admyn',
  api: '/admyn/'
};