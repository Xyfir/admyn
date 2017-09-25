import PropTypes from 'prop-types';
import request from 'superagent';
import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import Button from 'react-md/lib/Buttons/Button';
import Dialog from 'react-md/lib/Dialogs';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

// Components
import Form from './Form';

export default class TableRows extends React.Component {

  constructor(props) {
    super(props);

    const orderBy =
      (props.structure.find(c => c.Key == 'PRI') || props.structure[0]).Field;

    this.state = {
      rows: [], selected: -1,
      columns: '*', orderBy, ascending: true, limit: 25, page: 1, search: []
    };

    this.keys =
      props.structure.filter(c => c.Key == 'PRI').map(c => c.Field),
    this.api =
      props.api + 'databases/' +
      props.url[1] + '/tables/' +
      props.url[3] + '/rows';

    this._loadRows = this._loadRows.bind(this);
  }

  componentWillMount() {
    this._loadRows();
  }

  /** @param {number} v */
  onChangePage(v) {
    this.setState({ page: this.state.page + v }, this._loadRows);
  }

  /** @param {string} col */
  onSort(col) {
    this.setState({
      orderBy: col,
      ascending: this.state.orderBy == col ? !this.state.ascending : true
    }, this._loadRows);
  }

  onDelete() {
    const row = this.state.rows[this.state.selected];
    const where = {};

    this.keys.forEach(k => where[k] = row[k]);

    request
      .delete(this.api)
      .send({ where })
      .end((err, res) => !err && this._loadRows());
  }

  /** @param {object} data */
  onEdit(data) {
    const row = this.state.rows[this.state.selected];
    const where = {};

    this.keys.forEach(k => where[k] = row[k]);

    request
      .put(this.api)
      .send({ set: data, where })
      .end((err, res) => !err && this._loadRows());
  }

  _loadRows() {
    request
      .get(this.api)
      .query(
        Object.assign({}, this.state, { rows: undefined, selected: undefined })
      )
      .end((err, res) =>
        !err && this.setState({ rows: res.body, selected: -1 })
      );
  }

  render() {
    const {structure, url} = this.props;
    const {rows} = this.state;

    return (
      <div className='rows'>
        <TabsContainer
          colored
          panelClassName='md-grid'
          defaultTabIndex={0}
        >
          <Tabs tabId='tab' className='tabs'>
            <Tab label='Data' />

            <Tab
              label='Structure'
              onClick={() => location.hash =
                `#/databases/${url[1]}/tables/${url[3]}/structure`
              }
            />
          </Tabs>
        </TabsContainer>

        <DataTable plain className='table-data'>
          <TableHeader>
            <TableRow>{
              structure.map(col =>
                <TableColumn
                  key={col.Field}
                  sorted={col.Field == this.state.orderBy}
                  onClick={() => this.onSort(col.Field)}
                >{col.Field}</TableColumn>
              )
            }</TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, i) =>
              <TableRow
                key={
                  this.keys.length
                    ? this.keys.map(k => row[k]).join('-')
                    : i
                }
                onClick={() => this.setState({ selected: i })}
              >
                {this.props.structure.map(col =>
                  <TableColumn key={col.Field}>{
                    row[col.Field]
                  }</TableColumn>
                )}
              </TableRow>
            )}
          </TableBody>
        </DataTable>

        <div className='pagination'>
          {this.state.page > 1 ? (
            <Button
              icon secondary
              iconChildren='keyboard_arrow_left'
              onClick={() => this.onChangePage(-1)}
            />
          ) : null}

          {this.state.rows.length >= this.state.limit ? (
            <Button
              icon primary
              iconChildren='keyboard_arrow_right'
              onClick={() => this.onChangePage(1)}
            />
          ) : null}
        </div>

        <Button
          floating fixed primary
          tooltipPosition='left'
          fixedPosition='br'
          tooltipLabel='Insert row'
          iconChildren='add'
          onClick={() => location.hash += '/insert'}
        />

        <Dialog
          fullPage
          id='dialog--selected-row'
          onHide={() => this.setState({ selected: -1 })}
          visible={this.state.selected > -1 && !!this.keys.length}
          aria-label='selected-row'
        >
          <Button
            floating fixed primary
            tooltipPosition='left'
            fixedPosition='br'
            tooltipLabel='Close'
            iconChildren='close'
            onClick={() => this.setState({ selected: -1 })}
          />

          <Button
            floating fixed secondary
            tooltipPosition='right'
            fixedPosition='bl'
            tooltipLabel='Delete'
            iconChildren='delete'
            onClick={() => this.onDelete()}
          />

          <Form
            structure={this.props.structure}
            onSubmit={d => this.onEdit(d)}
            row={this.state.rows[this.state.selected]}
          />
        </Dialog>
      </div>
    )
  }

}

/* For some reason this throws an error when uncommented
TableRows.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object).isRequired,
  url: PropTypes.array(PropTypes.string).isRequired,
  api: PropTypes.string.isRequired
};*/