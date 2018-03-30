import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';

import styles from './Home.css';

import { incrementAction } from '../actions/count';
import {
  getHeaderAction,
  getFooterAction,
  getTittleAction,
} from '../actions/html';

import img from './img.png';

@connect(state => ({ count: state.count }))
@hot(module)
export default class Home extends React.Component {
  /**
   * Get initial props for both ssr and client side.
   * @async
   * @static
   * @param {Function} dispatch - store.dispatch
   * @param {Object} params - from url, '/:id/:name' {id: xxx, name: xxx}
   * @param {Object} queryParams - location.search '/?name=xxx' {name: xxx}
   * @param {boolean} isClient - client or server environment
   */
  static async getInitialProps({
    // eslint-disable-next-line no-unused-vars
    dispatch, params, queryParams, isClient,
  }) {
    if (!isClient) {
      await dispatch(getHeaderAction());
      await dispatch(getFooterAction());
    }

    if (isClient) {
      await dispatch(incrementAction(2));
      await dispatch(incrementAction(4));
    }

    await dispatch(getTittleAction());

    // test dynamic import
    const test = await import('../components/test');
    test.default();

    return null;
  }

  /**
   * whether server render, default true
   * @static
   */
  // static CMPSSR = true;

  /**
   * whether server render cache, default false
   * @static
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

    Home.getInitialProps({
      dispatch, params, queryParams: {}, isClient: true,
    })
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
        <div className={styles.square} />
        <div>
          <img src={img} alt="img" />
        </div>
      </Fragment>
    );
  }
}
