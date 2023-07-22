import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

type messageType = {
  label: string;
  description: string;
  link: string;
  redirect: string | null;
  tweetLink?: string;
};

export interface callLoaderState {
  callState: 'none' | 'loading' | 'success' | 'failure';
  loadingLabel: string;
  success: messageType;
  failure: messageType;
}

const initialState: callLoaderState = {
  callState: 'none',
  loadingLabel: 'Loading...',
  success: {
    label: '',
    description: '',
    link: '',
    redirect: null,
  },
  failure: {
    label: '',
    description: '',
    link: '',
    redirect: null,
  },
};

export const callLoaderSlice = createSlice({
  name: 'callLoader',
  initialState,
  reducers: {
    onLoading: (state, action: PayloadAction<string>) => {
      state.callState = 'loading';
      state.loadingLabel = action.payload;
    },
    onSuccess: (state, action: PayloadAction<messageType>) => {
      state.callState = 'success';
      state.success = action.payload;
    },
    onFailure: (state, action: PayloadAction<messageType>) => {
      state.callState = 'failure';
      state.failure = action.payload;
    },
    resetLoader: (state) => {
      state.callState = 'none';
      state.loadingLabel = 'Loading...';
      state.success = {
        label: '',
        description: '',
        link: '',
        redirect: null,
      };
      state.failure = {
        label: '',
        description: '',
        link: '',
        redirect: null,
      };
    },
  },
});

export default callLoaderSlice.reducer;
export const selectcallLoader = (state: AppState) => state.callLoader;
export const { onLoading, onSuccess, onFailure, resetLoader } =
  callLoaderSlice.actions;
