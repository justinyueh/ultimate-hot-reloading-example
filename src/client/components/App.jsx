import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import styles from './App.css';

class AppComponent extends React.Component {
  render() {
    const { count, dispatch } = this.props;
    return (
      <Fragment>
        <h1>Demo</h1>
        <p>{count.num}</p>
        <button
          className={styles.increment}
          onClick={() => dispatch({type: "INC"})}
        >
          +1
        </button>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
      </Fragment>
    );
  }
}

AppComponent.propTypes = {
  count: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const App = connect(state => ({count: state}))(AppComponent);

export default hot(module)(App);
