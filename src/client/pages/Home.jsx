import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';

import styles from './Home.css';

import { incrementAction } from '../actions/count';

@connect(state => ({ count: state.count }))
@hot(module)
export default class Home extends React.Component {
  /**
    * @dispatch store.dispatch
    * @params params from url '/:id/:name' {id: xxx, name: xxx}
    * @queryParams params from location.search '/?name=xxx' {name: xxx}
    */
  // eslint-disable-next-line no-unused-vars
  static async getInitialProps(dispatch, params, queryParams) {
    await dispatch(incrementAction(2));
    await dispatch(incrementAction(4));

    return null;
  }

  /**
   * whether server render, default true
   */
  // static CMPSSR = true;

  /**
   * whether server render cache, default false
   */
  static SSRCACHE() {
    return true;
  }

  static defaultProps = {
    count: {},
    dispatch() {},
  }

  static propTypes = {
    location: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    count: PropTypes.shape(),
    dispatch: PropTypes.func,
  }

  componentDidMount() {
    const { dispatch, match: { params } } = this.props;

    Home.getInitialProps(dispatch, params, {})
      .then(() => {
        dispatch((dispatch1, getState) => {
          console.log('number', getState().count.number);
        });
      });
  }

  render() {
    const { count, location, dispatch } = this.props;

    return (
      <Fragment>
        <h1>Home page.</h1>
        <p>{count.number}</p>
        <pre>{location.search}</pre>
        <button
          className={styles.increment}
          onClick={() => dispatch(incrementAction())}
        >
          +1
        </button>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
        <Link to="/about?name=about">go to about page</Link>
        <br />
        <Link to="/1111/about?name=你好">go to another about page</Link>
        <br />
        <Link to={{ pathname: '/1/about', search: 'name=你好' }}>go to another about page</Link>
      </Fragment>
    );
  }
}
