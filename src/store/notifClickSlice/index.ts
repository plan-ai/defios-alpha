import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface notifClickState {
  searchQuery: string;
  setSearchQuery: boolean;
  expandFirst: boolean;
}

const initialState: notifClickState = {
  searchQuery: '',
  setSearchQuery: false,
  expandFirst: false,
};

export const notifClickSlice = createSlice({
  name: 'notifClick',
  initialState,
  reducers: {
    clicked: (state, action: PayloadAction<notifClickState>) => {
      state.searchQuery = action.payload.searchQuery;
      state.setSearchQuery = action.payload.setSearchQuery;
      state.expandFirst = action.payload.expandFirst;
    },
    reset: (state) => {
      state.searchQuery = '';
      state.setSearchQuery = false;
      state.expandFirst = false;
    },
  },
});

export default notifClickSlice.reducer;
export const selectNotifClick = (state: AppState) => state.notifClick;
export const { clicked, reset } = notifClickSlice.actions;
