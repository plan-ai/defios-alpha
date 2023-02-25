import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface userInfoState {
  githubInfo: any;
}

const initialState: userInfoState = {
  githubInfo: null,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setGithub: (state, action: PayloadAction<userInfoState>) => {
      state.githubInfo = action.payload;
    },
  },
});

export default userInfoSlice.reducer;
export const selectUserInfo = (state: AppState) => state.userInfo;
export const { setGithub } = userInfoSlice.actions;
