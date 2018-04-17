import PropTypes from 'prop-types';
import React from 'react';

// Components
import Navigation from './app/Navigation';
import Databases from './databases/Databases';

export default class Admyn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: location.hash.substr(2).split('/')
    };

    window.onhashchange = () => {
      const url = location.hash.substr(2).split('/');

      if (
        (this.state.url[1] && url[1] && this.state.url[1] != url[1]) ||
        (this.state.url[3] && url[3] && this.state.url[3] != url[3])
      )
        location.reload();
      else this.setState({ url });
    };
  }

  render() {
    const props = Object.assign({}, { url: this.state.url }, this.props);
    const view = (() => {
      // Currently the only top-level component/section
      return <Databases {...props} />;
    })();

    return (
      <div className="admyn">
        <Navigation {...props} />
        {view}
      </div>
    );
  }
}

Admyn.propTypes = {
  title: PropTypes.string,
  api: PropTypes.string
};

Admyn.defaultProps = {
  title: 'Admyn',
  api: '/admyn/'
};
