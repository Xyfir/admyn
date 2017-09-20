import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import ListItem from 'react-md/lib/Lists/ListItem';
import List from 'react-md/lib/Lists/List';

// Components
import Table from './Table';

export default class Tables extends React.Component {

  constructor(props) {
    super(props);

    this.state = { tables: [] };
  }

  componentWillMount() {
    request
      .get(`${this.props.api}databases/${this.props.url[1]}/tables`)
      .end((err, res) => !err && this.setState({ tables: res.body }));
  }

  render() {
    if (!this.state.tables.length) return null;
    if (this.props.url.length > 3) return <Table {...this.props} />

    const db = this.props.url[1];

    return (
      <List className='tables md-paper md-paper--1'>{
        this.state.tables.map(t =>
          <ListItem
            key={t}
            onClick={() => location.hash =
              `#/databases/${db}/tables/${t}/rows`
            }
            primaryText={t}
          />
        )
      }</List>
    )
  }

}

Tables.propTypes = {
  url: PropTypes.arrayOf(PropTypes.string).isRequired,
  api: PropTypes.string.isRequired
};