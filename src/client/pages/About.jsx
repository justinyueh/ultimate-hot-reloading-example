import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Link } from 'react-router-dom';

import styles from './About.css';

import { incrementAction } from '../actions/count';

@connect(state => ({ count: state.count }))
@hot(module)
export default class About extends React.Component {
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
    await dispatch(incrementAction(2));
    await dispatch(incrementAction(4));

    return null;
  }

  /**
   * whether server render, default true
   * @static
   */
  static CMPSSR = true;

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
    const queryParams = {};

    About.getInitialProps({
      dispatch, params, queryParams, isClient: true,
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
        <h1>About page.</h1>
        <p>Count: {count.number}</p>
        <pre>name {decodeURIComponent(location.search)}</pre>
        <button
          className={styles.increment}
          onClick={() => dispatch(incrementAction(3))}
        >
          +1
        </button>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
        <Link to="/about?name=about">go to about page</Link>
      </Fragment>
    );
  }
}
