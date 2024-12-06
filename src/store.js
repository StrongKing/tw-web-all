import { createStore, combineReducers } from 'redux';
import rootReducer from './reducers';

export default function configStore() {
  const store = createStore(
    combineReducers({
      ...rootReducer,
    }),
  );
  return store;
}
