import {
    AnyAction,
    CombinedState,
    combineReducers,
    Reducer
} from '@reduxjs/toolkit'
import userMappingReducer from './userMappingSlice'

const appReducer = combineReducers({
    userMapping: userMappingReducer
})

export type AppState = CombinedState<{
    userMapping: ReturnType<typeof userMappingReducer>
}>

const rootReducer: Reducer = (state: AppState, action: AnyAction) => {
    return appReducer(state, action)
}

export default rootReducer