import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// Components
import Form from './Form';

export default class InsertRow extends React.Component {

  constructor(props) {
    super(props);
  }

  onSubmit(data) {
    const route =
      'databases/' +
      this.props.url[1] + '/tables/' +
      this.props.url[3] + '/rows';

    request
      .post(this.props.api + route)
      .send({ data })
      .end((err, res) => {
        if (!err) return;

        location.hash = '#/' + route;
      });
  }

  render() {
    return (
      <Form
        structure={this.props.structure}
        onSubmit={d => this.onSubmit(d)}
      />
    )
  }

}

/* For some reason this throws an error when uncommented
InsertRow.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object).isRequired,
  url: PropTypes.array(PropTypes.string).isRequired,
  api: PropTypes.string.isRequired
};*/