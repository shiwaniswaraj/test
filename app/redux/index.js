import { compose, createStore, applyMiddleware } from 'redux';
import reducers from './reducers/index';
import thunk from "redux-thunk";
const middleware = [thunk];

 
const store = createStore(reducers, compose(applyMiddleware(...middleware)));

export default store;
