import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface roadmapFilterState {
  filter: any;
  triggerSet: boolean;
  searchTrigger: boolean;
}

const initialState: roadmapFilterState = {
  filter: {},
  triggerSet: false,
  searchTrigger: false,
};

export const roadmapFilterSlice = createSlice({
  name: 'roadmapFilter',
  initialState,
  reducers: {
    triggerFilter: (state) => {
      state.triggerSet = true;
    },
    setFilters: (state, action: PayloadAction<any>) => {
      state.filter = action.payload;
      state.triggerSet = false;
      state.searchTrigger = true;
    },
    reset: (state) => {
      state.filter = {};
      state.triggerSet = false;
      state.searchTrigger = false;
    },
    searchDone: (state) => {
      state.searchTrigger = false;
    },
  },
});

export default roadmapFilterSlice.reducer;
export const selectroadmapFilter = (state: AppState) => state.roadmapFilter;
export const { setFilters, reset, triggerFilter, searchDone } =
  roadmapFilterSlice.actions;
