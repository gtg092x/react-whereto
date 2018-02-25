import React from 'react';
import { Link, Route } from 'react-router-dom';
import DispatcherProvider from '../../src/DispatcherProvider';
import RouteDispatcher from '../../src/RouteDispatcher';
import withRouteSelector from '../../src/withRouteSelector';
import { connect } from 'react-redux';

const handleLoad = (id, rest) => async (dispatch, getState, { history }) => {
  if (Number(id) === 3) {
    return history.push('/user/2');
  }
  await new Promise(resolve => setTimeout(resolve, 30));
  return dispatch({
    type: 'SET_META',
    data: { user: id },
  });
};

const hiMom = type => match => async (dispatch) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return dispatch({ type });
};

export const routeDispatcher = new RouteDispatcher()
  .route('/', { strict: true, exact: true }, hiMom('foo'))
  .route('/one', { strict: true, exact: true }, { type: 'one' })
  .route('strict!/two', { strict: true, exact: true }, { type: 'two' })
  .route('/user/:id', ({ params: { id }, query }) => handleLoad(id, query));

class MyRichComponent extends React.Component {
  render() {
    return (
      <div>
        hi
      </div>
    );
  }
}

const MyRouteSelectedComponent = withRouteSelector({
  '/user/:id': ({ params }, props) => ({ hello: params.id, stuff: props.myProp }),
  '!exact/': ({ root: 'thing' }),
})(({ hello, user, stuff }) => {
  return <div>hello {hello} {user} {JSON.stringify(stuff)}</div>;
});

const LinkButton = connect()(({ dispatch, to, ...props }) => <button type="button" onClick={() => dispatch((_, __, { history }) => {
  history.push(to);
})} {...props} />);

const MyRoutes = () => (
    <DispatcherProvider dispatcher={routeDispatcher}>
      <div>
        <Link to="/">
          Root
        </Link>
        <br />
        <Link to="/one">
          One
        </Link>
        <br />
        <Link to="/two">
          Two
        </Link>
        <br />
        <Link to="/user/1?query2=world">
          User 1
        </Link>
        <br />
        <Link to="/user/2?query2=mom">
          User 2
        </Link>
        <br />
        <LinkButton to="/user/3">
          User 3
        </LinkButton>
        <MyRouteSelectedComponent myProp="hi mom" />
        <Route strict exact path="/" component={MyRichComponent} />
        <Route path="/one" component={MyRichComponent} />
        <Route path="/two" component={MyRichComponent} />
        <Route path="/user/:id" component={MyRichComponent} />
      </div>
    </DispatcherProvider>

);

export default MyRoutes;
