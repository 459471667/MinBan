import {applyMiddleware, combineReducers, createStore} from 'redux';
import {classListReducer, gradeListReducer, messageReducer, orgListReducer} from './reducers/message';
import thunk from 'redux-thunk';

/**
 * All reducers list
 * @type {Reducer<any>}
 */

const reducer = combineReducers({
    messageReducer,
    gradeListReducer,
    classListReducer,
    orgListReducer,
});
const store = createStore(
    reducer,
    applyMiddleware(thunk)
);
export default store;