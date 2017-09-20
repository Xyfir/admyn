import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// Components
import Structure from './Structure';
import Insert from './rows/Insert';
import Rows from './rows/Rows';

export default class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = { structure: [] };
  }

  componentWillMount() {
    request
      .get(
        this.props.api + 'databases/' +
        this.props.url[1] + '/tables/' +
        this.props.url[3] + '/structure'
      )
      .end((err, res) => !err && this.setState({ structure: res.body }));
  }

  render() {
    if (!this.state.structure.length) return null;

    const props = Object.assign(
      {}, this.props, { structure: this.state.structure }
    );

    if (this.props.url[4] == 'rows') {
      if (this.props.url[5] == 'insert')
        return <Insert {...props} />
      else
        return <Rows {...props} />
    }
    else {
      return <Structure {...props} />
    }
  }

}

Table.propTypes = {
  url: PropTypes.arrayOf(PropTypes.string).isRequired,
  api: PropTypes.string.isRequired
};