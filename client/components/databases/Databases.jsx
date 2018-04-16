import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

// Components
import Tables from './tables/Tables';

export default class Databases extends React.Component {
  constructor(props) {
    super(props);

    this.state = { databases: [] };
  }

  componentWillMount() {
    request
      .get(this.props.api + 'databases')
      .end((err, res) => !err && this.setState({ databases: res.body }));
  }

  render() {
    if (!this.state.databases.length) return null;
    if (this.props.url.length > 1) return <Tables {...this.props} />;

    return (
      <List className="databases md-paper md-paper--1 margin">
        {this.state.databases.map(db => (
          <ListItem
            key={db}
            onClick={() => (location.hash = `#/databases/${db}/tables`)}
            primaryText={db}
          />
        ))}
      </List>
    );
  }
}

Databases.propTypes = {
  url: PropTypes.arrayOf(PropTypes.string).isRequired,
  api: PropTypes.string.isRequired
};
