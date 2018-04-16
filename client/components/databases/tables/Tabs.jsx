import React from 'react';

// react-md
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';

export default ({ index, url }) => (
  <TabsContainer colored className="table-tabs" defaultTabIndex={index}>
    <Tabs tabId="tab" className="tabs">
      <Tab
        label="Data"
        onClick={() =>
          (location.hash = `#/databases/${url[1]}/tables/${url[3]}/rows`)
        }
      />

      <Tab
        label="Structure"
        onClick={() =>
          (location.hash = `#/databases/${url[1]}/tables/${url[3]}/structure`)
        }
      />

      <Tab
        label="Insert"
        onClick={() =>
          (location.hash = `#/databases/${url[1]}/tables/${url[3]}/rows/insert`)
        }
      />
    </Tabs>
  </TabsContainer>
);
