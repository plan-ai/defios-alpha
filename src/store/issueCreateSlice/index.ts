import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface step1Props {
  projectName: string;
  repoLink: string;
  repoId: string;
  selectedProject: any;
  tokenSymbol: string;
  tokenName: string;
  tokenDecimals: number;
  tokenImgLink: string;
  issueType: 'create' | 'import';
  issueTitle: string;
  issueDescription: string;
  selectedIssue: any;
  tokenIncentive: number;
  tags: string[];
  issueNumber: number | undefined;
  issueLink: string | undefined;
}

export interface step3Props {
  repoLink: string;
  issueLink: string;
}

export interface creationState {
  step1: step1Props;
  step3: step3Props;
}

const initialState: creationState = {
  step1: {
    projectName: '',
    repoLink: '',
    repoId: '',
    selectedProject: undefined,
    tokenSymbol: '',
    tokenName: '',
    tokenDecimals: 0,
    tokenImgLink: '',
    issueType: 'create',
    issueTitle: '',
    issueDescription: '',
    selectedIssue: undefined,
    tokenIncentive: 0,
    tags: [],
    issueNumber: undefined,
    issueLink: undefined,
  },
  step3: {
    issueLink: '',
    repoLink: '',
  },
};

export const issueCreate = createSlice({
  name: 'issueCreate',
  initialState,
  reducers: {
    setStep1Data: (state, action: PayloadAction<step1Props>) => {
      state.step1 = action.payload;
    },
    setStep3Data: (state, action: PayloadAction<step3Props>) => {
      state.step3 = action.payload;
    },
    reset: (state) => {
      state.step1 = {
        projectName: '',
        repoLink: '',
        repoId: '',
        selectedProject: undefined,
        tokenSymbol: '',
        tokenName: '',
        tokenDecimals: 0,
        tokenImgLink: '',
        issueType: 'create',
        issueTitle: '',
        issueDescription: '',
        selectedIssue: undefined,
        tokenIncentive: 0,
        tags: [],
        issueNumber: undefined,
        issueLink: undefined,
      };
      state.step3 = {
        issueLink: '',
        repoLink: '',
      };
    },
  },
});

export default issueCreate.reducer;
export const selectCreation = (state: AppState) => state.issueCreate;
export const { setStep1Data,setStep3Data, reset } = issueCreate.actions;
