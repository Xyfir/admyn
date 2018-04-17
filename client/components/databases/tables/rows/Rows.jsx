import {
  ListItemControl,
  DialogContainer,
  SelectField,
  TableHeader,
  TableColumn,
  DataTable,
  TableBody,
  TextField,
  Checkbox,
  TableRow,
  ListItem,
  FontIcon,
  Button,
  List
} from 'react-md';
import request from 'superagent';
import React from 'react';

// Components
import Tabs from '../Tabs';
import Form from './Form';

export default class TableRows extends React.Component {
  constructor(props) {
    super(props);

    const orderBy = (
      props.structure.find(c => c.Key == 'PRI') || props.structure[0]
    ).Field;

    this.state = {
      rows: [],
      selected: -1,
      dialog: '',
      custom: false,
      query: '',
      columns: ['*'],
      orderBy,
      ascending: true,
      limit: 25,
      page: 1,
      search: []
    };

    this.keys = props.structure.filter(c => c.Key == 'PRI').map(c => c.Field);
    this.api = `${props.api}databases/${props.url[1]}/tables/${
      props.url[3]
    }/rows`;

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
    this.setState(
      {
        orderBy: col,
        ascending: this.state.orderBy == col ? !this.state.ascending : true
      },
      this._loadRows
    );
  }

  onDelete() {
    const row = this.state.rows[this.state.selected];
    const where = {};

    this.keys.forEach(k => (where[k] = row[k]));

    request
      .delete(this.api)
      .send({ where })
      .end((err, res) => !err && this._loadRows());
  }

  /** @param {object} data */
  onEdit(data) {
    const row = this.state.rows[this.state.selected];
    const where = {};

    this.keys.forEach(k => (where[k] = row[k]));

    request
      .put(this.api)
      .send({ set: data, where })
      .end((err, res) => !err && this._loadRows());
  }

  /**
   * Toggles whether a column should be shown or not.
   * @param {string} field
   * @param {boolean} show
   */
  onToggleColumn(field, show) {
    let columns = this.state.columns.slice();

    // Key columns cannot be hidden because they're needed for editing
    // and deleting rows
    if (this.keys.indexOf(field) > -1) return;

    // Show all columns other than the provided column
    if (columns[0] == '*') {
      columns = this.props.structure
        .map(col => col.Field)
        .filter(col => col != field);
    }
    // Add or remove column from list
    else {
      if (show) columns.push(field);
      else columns = columns.filter(col => col != field);
    }

    this.setState({ columns }, () => this._loadRows());
  }

  onCustomQuery() {
    request
      .post(`${this.props.api}databases/${this.props.url[1]}/query`)
      .send({ query: this.state.query })
      .end(
        (err, res) => !err && this.setState({ rows: res.body, custom: true })
      );
  }

  /**
   * @param {number} i - i[ndex]
   * @param {string} p - p[rop]
   * @param {string} v - v[alue]
   */
  onSearchChange(i, p, v) {
    const search = this.state.search.slice();
    search[i][p] = v;
    this.setState({ search });
  }

  onAddSearch() {
    this.setState({
      search: this.state.search.concat({
        column: this.props.structure[0].Field,
        query: '',
        type: 'like'
      })
    });
  }

  onResetSearch() {
    this.setState({ search: [] }, this._loadRows);
  }

  _loadRows() {
    const { state: s } = this;

    request
      .get(this.api)
      .query({
        columns: s.columns.join(','),
        orderBy: s.orderBy,
        search: JSON.stringify(s.search),
        ascending: s.ascending || undefined,
        limit: s.limit,
        page: s.page
      })
      .end(
        (err, res) => !err && this.setState({ rows: res.body, selected: -1 })
      );
  }

  render() {
    const { rows, custom, columns, search } = this.state;
    const structure = this.state.custom
      ? Object.keys(rows[0] || {}).map(Field => Object({ Field }))
      : this.props.structure;

    return (
      <div className="rows">
        <Tabs url={this.props.url} index={0} />

        <DataTable plain className="table-data">
          <TableHeader>
            <TableRow>
              {structure
                .filter(
                  col => columns[0] == '*' || columns.indexOf(col.Field) > -1
                )
                .map(col => (
                  <TableColumn
                    key={col.Field}
                    sorted={col.Field == this.state.orderBy}
                    onClick={() => !custom && this.onSort(col.Field)}
                  >
                    {col.Field}
                  </TableColumn>
                ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={
                  this.keys.length ? this.keys.map(k => row[k]).join('-') : i
                }
                onClick={() => !custom && this.setState({ selected: i })}
              >
                {structure
                  .filter(
                    col => columns[0] == '*' || columns.indexOf(col.Field) > -1
                  )
                  .map(col => (
                    <TableColumn key={col.Field}>{row[col.Field]}</TableColumn>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </DataTable>

        <div className="pagination">
          {this.state.page > 1 && !custom ? (
            <Button
              icon
              secondary
              iconChildren="keyboard_arrow_left"
              onClick={() => this.onChangePage(-1)}
            />
          ) : null}

          {rows.length >= this.state.limit && !custom ? (
            <Button
              icon
              primary
              iconChildren="keyboard_arrow_right"
              onClick={() => this.onChangePage(1)}
            />
          ) : null}
        </div>

        <Button
          floating
          fixed
          primary
          tooltipPosition="left"
          fixedPosition="br"
          tooltipLabel="Open menu"
          iconChildren="more_vert"
          onClick={() => this.setState({ dialog: 'menu' })}
        />

        <DialogContainer
          id="dialog"
          onHide={() => this.setState({ dialog: '' })}
          visible={!!this.state.dialog}
          aria-label="dialog"
        >
          {this.state.dialog == 'query' ? (
            <div className="custom-query">
              <TextField
                id="textarea--custom-query"
                rows={2}
                type="text"
                value={this.state.query}
                maxRows={5}
                onChange={v => this.setState({ query: v })}
                className="md-cell"
              />

              <Button primary flat onClick={() => this.onCustomQuery()}>
                Submit
              </Button>
            </div>
          ) : this.state.dialog == 'columns' ? (
            <List className="columns">
              {structure.map(col => (
                <ListItemControl
                  key={col.Field}
                  primaryAction={
                    <Checkbox
                      id={'checkbox--col-' + col.Field}
                      name={'checkbox--col-' + col.Field}
                      label={col.Field}
                      checked={
                        columns[0] == '*' || columns.indexOf(col.Field) > -1
                      }
                      onChange={c => this.onToggleColumn(col.Field, c)}
                    />
                  }
                />
              ))}
            </List>
          ) : this.state.dialog == 'search' ? (
            <div className="search-container">
              {search.map((s, i) => (
                <div className="search" key={i}>
                  <SelectField
                    id={`select--column--${i}`}
                    label="Column"
                    value={s.column}
                    onChange={v => this.onSearchChange(i, 'column', v)}
                    menuItems={structure.map(col => col.Field)}
                  />
                  <TextField
                    floating
                    id={`text--search-${i}`}
                    type="text"
                    value={s.query}
                    label="Search Query"
                    onChange={v => this.onSearchChange(i, 'query', v)}
                  />
                  <SelectField
                    id={`select--search-type-${i}`}
                    value={s.type}
                    label="Search Type"
                    onChange={v => this.onSearchChange(i, 'type', v)}
                    menuItems={['like', 'exact', 'regexp']}
                  />
                </div>
              ))}

              <Button raised primary onClick={() => this._loadRows()}>
                Search
              </Button>

              <div className="secondary-controls">
                <Button raised secondary onClick={() => this.onAddSearch()}>
                  Add
                </Button>
                <Button raised secondary onClick={() => this.onResetSearch()}>
                  Reset
                </Button>
              </div>
            </div>
          ) : this.state.dialog == 'menu' ? (
            <List className="dialog-menu">
              <ListItem
                onClick={() => this.setState({ dialog: 'query' })}
                leftIcon={<FontIcon>code</FontIcon>}
                primaryText="Custom Query"
              />
              <ListItem
                onClick={() => this.setState({ dialog: 'columns' })}
                leftIcon={<FontIcon>view_column</FontIcon>}
                primaryText="Toggle Columns"
              />
              <ListItem
                onClick={() => this.setState({ dialog: 'search' })}
                leftIcon={<FontIcon>search</FontIcon>}
                primaryText="Search"
              />
            </List>
          ) : null}
        </DialogContainer>

        <DialogContainer
          id="dialog--selected-row"
          onHide={() => this.setState({ selected: -1 })}
          visible={this.state.selected > -1 && !!this.keys.length}
          aria-label="selected-row"
        >
          <Form
            structure={structure}
            onDelete={() => this.onDelete()}
            onSubmit={d => this.onEdit(d)}
            row={this.state.rows[this.state.selected]}
          />
        </DialogContainer>
      </div>
    );
  }
}
