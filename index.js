/* eslint-disable react/react-in-jsx-scope */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import store from './src/reduxFolder/store';

const AppRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppRedux);
