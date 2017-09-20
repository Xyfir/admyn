import PropTypes from 'prop-types';
import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

export default class TableStructure extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {structure, url} = this.props;

    return (
      <TabsContainer
        colored
        panelClassName='md-grid'
        defaultTabIndex={1}
      >
        <Tabs tabId='tab' className='tabs'>
          <Tab
            label='Data'
            onClick={() => location.hash =
              `#/databases/${url[1]}/tables/${url[3]}/rows`
            }
          />

          <Tab label='Structure'>
            <DataTable plain className='table-structure'>
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
                {structure.map(col =>
                  <TableRow key={col.Field}>
                    <TableColumn>{col.Field}</TableColumn>
                    <TableColumn>{col.Type}</TableColumn>
                    <TableColumn>{col.Key}</TableColumn>
                    <TableColumn>{col.Null}</TableColumn>
                    <TableColumn>{col.Default + ''}</TableColumn>
                    <TableColumn>{col.Extra}</TableColumn>
                  </TableRow>
                )}
              </TableBody>
            </DataTable>
          </Tab>
        </Tabs>
      </TabsContainer>
    )
  }

}

/*
For some reason this throws an error when uncommented
TableStructure.propTypes = {
  structure: PropTypes.arrayOf(PropTypes.object).isRequired,
  url: PropTypes.array(PropTypes.string).isRequired
};*/