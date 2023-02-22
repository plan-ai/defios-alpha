import {
  AnyAction,
  CombinedState,
  combineReducers,
  Reducer,
} from '@reduxjs/toolkit';
import userMappingReducer from './userMappingSlice';
import notifClickReducer from './notifClickSlice';

const appReducer = combineReducers({
  userMapping: userMappingReducer,
  notifClick: notifClickReducer,
});

export type AppState = CombinedState<{
  userMapping: ReturnType<typeof userMappingReducer>;
  notifClick: ReturnType<typeof notifClickReducer>;
}>;

const rootReducer: Reducer = (state: AppState, action: AnyAction) => {
  return appReducer(state, action);
};

export default rootReducer;
