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
  static async getInitialProps (dispatch, params) {
    const number = await dispatch(incrementAction(2));
    const numberx = await dispatch(incrementAction(4));

    return numberx;
  }

  static defaultProps = {
    count: {},
    dispatch() {},
  }

  static propTypes = {
    count: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    Home.getInitialProps(dispatch, params)
    .then((number) => {
      dispatch((dispatch, getState) => {
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
        <pre>name:{location.search}</pre>
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
        <Link to="/1111/about?name=about">go to another about page</Link>
      </Fragment>
    );
  }
}
