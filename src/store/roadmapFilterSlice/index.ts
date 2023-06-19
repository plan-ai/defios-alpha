import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

interface FilterProps {
  'filter.roadmap_outlook': string;
  'filter.roadmap_active_objectives': string;
}

export interface roadmapFilterState {
  filter: FilterProps;
  triggerSet: boolean;
  searchTrigger: boolean;
}

const initialState: roadmapFilterState = {
  filter: {
    'filter.roadmap_outlook': '',
    'filter.roadmap_active_objectives': '0,100',
  },
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
    setFilters: (state, action: PayloadAction<FilterProps>) => {
      state.filter['filter.roadmap_outlook'] =
        action.payload['filter.roadmap_outlook'];
      state.filter['filter.roadmap_active_objectives'] =
        action.payload['filter.roadmap_active_objectives'];
      state.triggerSet = false;
      state.searchTrigger = true;
    },
    reset: (state) => {
      state.filter['filter.roadmap_outlook'] = '';
      state.filter['filter.roadmap_active_objectives'] = '0,100';
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
