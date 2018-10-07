import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import isEqual from 'lodash.isequal';

const omit = (obj, excludeKey) => Object.keys(obj).reduce((memo, key) => {
  if (excludeKey === key) {
    return memo;
  }
  return ({
    ...memo,
    [key]: obj[key],
  });
}, {});

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
    this.lastLocation = history.location;
    this.unsubHistory = history.listen(this.historyUpdate);
  }

  getStore = () => this.props.store || this.context.store || {};
  getDispatch = () => this.props.dispatch || (this.getStore().dispatch);

  historyUpdate = (location) => {
    if (!isEqual(omit(location, 'key'), omit(this.lastLocation, 'key'))) {
      this.props.dispatcher.getThunkForValidRoutes(location, this.lastLocation)(this.getDispatch());
    }
    this.lastLocation = location;
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
