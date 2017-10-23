import PropTypes from 'prop-types';
import React from 'react';

// react-md
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import TextField from 'react-md/lib/TextFields';
import Button from 'react-md/lib/Buttons/Button';
import Paper from 'react-md/lib/Papers';

export default class RowForm extends React.Component {

  constructor(props) {
    super(props);

    this.inputs = {};
  }

  onSubmit() {
    const data = {};

    this.props.structure.forEach(col => {
      if (/^date/.test(col.Type))
        data[col.Field] = this.inputs[col.Field].state.value;
      else
        data[col.Field] = this.inputs[col.Field].value;
    });

    this.props.onSubmit(data);
  }

  render() {
    const {structure, row = {}} = this.props;

    return (
      <Paper
        zDepth={this.props.row ? 0 : 1}
        component='section'
        className='row-form'
      >
        {structure.map(col => {
          if (/text/.test(col.Type)) return (
            <TextField
              id={'col-' + col.Field}
              key={col.Field}
              ref={i => this.inputs[col.Field] = i}
              rows={2}
              type='text'
              label={col.Field}
              maxRows={10}
              helpText={col.Type}
              className='md-cell'
              defaultValue={row[col.Field]}
            />
          )
          if (/int\b/.test(col.Type)) return (
            <TextField
              id={'col-' + col.Field}
              key={col.Field}
              ref={i => this.inputs[col.Field] = i}
              type='number'
              label={col.Field}
              helpText={col.Type}
              className='md-cell'
              defaultValue={row[col.Field]}
            />
          )
          if (/^date/.test(col.Type)) return (
            <DatePicker
              id={'col-' + col.Field}
              key={col.Field}
              ref={i => this.inputs[col.Field] = i}
              label={col.Field}
              helpText={col.Type}
              className='md-cell'
              defaultValue={row[col.Field]}
            />
          )

          return (
            <TextField
              id={'col-' + col.Field}
              key={col.Field}
              ref={i => this.inputs[col.Field] = i}
              type='text'
              label={col.Field}
              helpText={col.Type}
              className='md-cell'
              defaultValue={row[col.Field]}
            />
          )
        })}

        <Button
          raised primary
          onClick={() => this.onSubmit()}
        >Submit</Button>
      </Paper>
    )
  }

}

RowForm.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSubmit: PropTypes.func.isRequired,
  row: PropTypes.object
};