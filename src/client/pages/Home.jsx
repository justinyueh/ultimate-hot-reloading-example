import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';

import styles from './Home.css';

function getData(num) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * 100);
    }, 2000);
  });
}

class HomeComponent extends React.Component {
  static async getInitialProps (dispatch, callback) {
    const number = await getData(1);
    const numberx = await getData(number);
    console.log('====', numberx);

    if (typeof callback === 'function') {
      callback(numberx);
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;

    HomeComponent.getInitialProps(dispatch, (number) => {
      console.log('number', number);
    });
  }

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

HomeComponent.propTypes = {
  count: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const Home = connect(state => ({count: state}))(HomeComponent);

export default hot(module)(Home);
