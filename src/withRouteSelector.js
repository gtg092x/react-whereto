import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, matchPath } from 'react-router';
import isEqual from 'lodash.isequal';
import { parseRoute, isFunction, isString } from './utils';

const withRouteSelector = (routes, config = {}) =>
  // eslint-disable-next-line no-unused-vars
  Component =>
    withRouter(class RouteSelectorWrapper extends React.Component {
      static propTypes = {
        history: PropTypes.object,
      };
      constructor(props) {
        super();
        this.state = {
          match: this.getStateForLocation(props.history.location, props),
        };
      }
      componentDidMount() {
        const { history } = this.props;
        if (!config.disabled) {
          this.unsubHistory = history.listen(this.historyUpdate);
        }
      }
      componentWillUnmount() {
        if (this.unsubHistory) {
          this.unsubHistory();
        }
      }
      getStateForLocation = (location, props = this.props) =>
        Object.keys(routes).map((key) => {
          const routeMatch = matchPath(location.pathname, parseRoute(key));
          if (!routeMatch) {
            return {};
          }
          const val = routes[key];
          let fn;
          if (isString(val)) {
            fn = route => ({ [val]: route });
          } else if (isFunction(val)) {
            fn = val;
          } else {
            fn = () => val;
          }
          return fn(routeMatch, props);
        }).reduce((memo, val) => ({
          ...memo,
          ...val,
        }), {});

      historyUpdate = () => {
        const { location } = this.props.history;
        if (!isEqual(location, this.lastLocation)) {
          const values = this.getStateForLocation(location);
          this.setState({
            match: values,
          });
        }
        this.lastLocation = { ...location };
      };
      render() {
        return <Component {...this.props} {...this.state.match} />;
      }
    });

export default withRouteSelector;
