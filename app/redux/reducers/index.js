import { combineReducers } from 'redux';
import auth from './auth';
import flight from './flight';

export default combineReducers({
  auth,
  flight
});