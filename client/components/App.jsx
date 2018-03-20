import React from 'react';
import PropTypes from 'prop-types';

import styles from './App.css';
import { connect } from 'react-redux';

class AppComponent extends React.Component {
  render() {
    const { count, dispatch } = this.props;
    return (
      <div>
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
      </div>
    );
  }
}

AppComponent.propTypes = {
  count: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const App = connect(state => ({count: state}))(AppComponent);

export default App;
