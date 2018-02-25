import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import isEqual from 'lodash.isequal';

class DispatcherProviderBase extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    dispatcher: PropTypes.object,
    store: PropTypes.object,
  };
  static contextTypes = {
    store: PropTypes.object,
  };
  componentDidMount() {
    const { history } = this.props;
    this.unsubHistory = history.listen(this.historyUpdate);
  }

  getStore = () => this.props.store || this.context.store || {};
  getDispatch = () => this.props.dispatch || (this.getStore().dispatch);

  historyUpdate = () => {
    const { location } = this.props.history;
    if (!isEqual(location, this.lastLocation)) {
      this.props.dispatcher.getThunkForValidRoutes(location)(this.getDispatch());
    }
    this.lastLocation = { ...location };
  };
  componentWillUnmount() {
    if (this.unsubHistory) {
      this.unsubHistory();
    }
  }
  render() {
    return this.props.children;
  }
}

export default withRouter(DispatcherProviderBase);