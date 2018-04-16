import PropTypes from 'prop-types';
import React from 'react';

// react-md
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';

// Components
import Tabs from './Tabs';

export default class TableStructure extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { structure, url } = this.props;

    return (
      <div>
        <Tabs url={url} index={1} />

        <DataTable plain className="table-structure">
          <TableHeader>
            <TableRow>
              <TableColumn>Name</TableColumn>
              <TableColumn>Type</TableColumn>
              <TableColumn>Key</TableColumn>
              <TableColumn>Null</TableColumn>
              <TableColumn>Default</TableColumn>
              <TableColumn>Extra</TableColumn>
            </TableRow>
          </TableHeader>

          <TableBody>
            {structure.map(col => (
              <TableRow key={col.Field}>
                <TableColumn>{col.Field}</TableColumn>
                <TableColumn>{col.Type}</TableColumn>
                <TableColumn>{col.Key}</TableColumn>
                <TableColumn>{col.Null}</TableColumn>
                <TableColumn>{col.Default + ''}</TableColumn>
                <TableColumn>{col.Extra}</TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}

/*
For some reason this throws an error when uncommented
TableStructure.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object).isRequired,
  url: PropTypes.array(PropTypes.string).isRequired
};*/
