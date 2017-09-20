import PropTypes from 'prop-types';
import React from 'react';

// react-md
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons/Button';

// Components
import Databases from './databases/Databases';

export default class ExpressqlAdminPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = { url: [] };

    window.onhashchange = () =>
      this.setState({ url: location.hash.substr(2).split('/') });
  }

  render() {
    const view = (() => {
      const props = {
        url: this.state.url, api: this.props.api
      };

      // Currently the only top-level component/section
      return <Databases {...props} />
    })();
    
    return (
      <div className='expressql'>
        <Toolbar
          colored fixed
          actions={[
            <Button
              icon
              iconChildren='home'
              onClick={() => location.hash = '#/databases'}
            />
          ]}
          title={this.props.title}
        />

        <div className='md-toolbar-relative'>{view}</div>
      </div>
    );
  }

}

ExpressqlAdminPanel.propTypes = {
  title: PropTypes.string,
  api: PropTypes.string
},

ExpressqlAdminPanel.defaultProps = {
  title: 'Expressql',
  api: '/expressql'
};