import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface refetchState {
  refetchPart: string;
}

const initialState: refetchState = {
  refetchPart: '',
};

export const refetchSlice = createSlice({
  name: 'refetch',
  initialState,
  reducers: {
    setRefetch: (state, action: PayloadAction<string>) => {
      state.refetchPart = action.payload;
    },
    resetRefetch: (state) => {
      state.refetchPart = '';
    },
  },
});

export default refetchSlice.reducer;
export const selectRefetch = (state: AppState) => state.refetch;
export const { setRefetch, resetRefetch } = refetchSlice.actions;
