import {
  AnyAction,
  CombinedState,
  combineReducers,
  Reducer,
} from '@reduxjs/toolkit';
import userMappingReducer from './userMappingSlice';
import notifClickReducer from './notifClickSlice';
import firebaseTokensReducer from './firebaseTokensSlice';
import userInfoReducer from './userInfoSlice';
import roadmapFilterReducer from './roadmapFilterSlice';
import callLoaderReducer from './callLoaderSlice';
import refetchReducer from './refetchSlice';
import newCreationReducer from './newCreationSlice';
import issueCreateReducer from './issueCreateSlice';

const appReducer = combineReducers({
  userMapping: userMappingReducer,
  notifClick: notifClickReducer,
  firebaseTokens: firebaseTokensReducer,
  userInfo: userInfoReducer,
  roadmapFilter: roadmapFilterReducer,
  callLoader: callLoaderReducer,
  refetch: refetchReducer,
  newCreation: newCreationReducer,
  issueCreate: issueCreateReducer,
});

export type AppState = CombinedState<{
  userMapping: ReturnType<typeof userMappingReducer>;
  notifClick: ReturnType<typeof notifClickReducer>;
  firebaseTokens: ReturnType<typeof firebaseTokensReducer>;
  userInfo: ReturnType<typeof userInfoReducer>;
  roadmapFilter: ReturnType<typeof roadmapFilterReducer>;
  callLoader: ReturnType<typeof callLoaderReducer>;
  refetch: ReturnType<typeof refetchReducer>;
  newCreation: ReturnType<typeof newCreationReducer>;
  issueCreate: ReturnType<typeof issueCreateReducer>;
}>;

const rootReducer: Reducer = (state: AppState, action: AnyAction) => {
  return appReducer(state, action);
};

export default rootReducer;
