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
    request
      .post('')
      .send({ data })
      .end((err, res) => {
        if (!err) return;

        location.hash = '#/' + this.props.url.slice(0, 4).join('/');
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