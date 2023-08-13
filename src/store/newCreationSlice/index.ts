import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface step1Props {
  repoName: string;
  repoLink: string;
  repoId: string;
  selectedRepo:any;
  projectName: string;
  projectDescription: string;
  tokenSymbol: string;
  tokenName: string;
  tokenType: string;
  tokenIcon: File | undefined;
}
export interface step2Props {
  issueType: 'create' | 'import';
  issueTitle: string;
  issueDescription: string;
  selectedIssue:any;
  tokenIncentive: number;
  usdcIncentive: number;
  tags: string[];
  issueNumber: number | undefined;
  issueLink: string | undefined;
}

export interface creationState {
  step1: step1Props;
  step2: step2Props;
}

const initialState: creationState = {
  step1: {
    repoName: '',
    repoLink: '',
    repoId: '',
    selectedRepo: undefined,
    projectName: '',
    projectDescription: '',
    tokenSymbol: '',
    tokenName: '',
    tokenType: '',
    tokenIcon: undefined,
  },
  step2: {
    issueType: 'create',
    issueTitle: '',
    issueDescription: '',
    selectedIssue:undefined,
    tokenIncentive: 0,
    usdcIncentive: 0,
    tags: [],
    issueNumber: undefined,
    issueLink: undefined,
  },
};

export const newCreation = createSlice({
  name: 'creation',
  initialState,
  reducers: {
    setStep1Data: (state, action: PayloadAction<step1Props>) => {
      state.step1 = action.payload;
    },
    setStep2Data: (state, action: PayloadAction<step2Props>) => {
      state.step2 = action.payload;
    },
    reset: (state) => {
      state.step1 = {
        repoName: '',
        repoLink: '',
        repoId: '',
        selectedRepo: undefined,
        projectName: '',
        projectDescription: '',
        tokenSymbol: '',
        tokenName: '',
        tokenType: '',
        tokenIcon: undefined,
      };
      state.step2 = {
        issueType: 'create',
        issueTitle: '',
        issueDescription: '',
        selectedIssue: undefined,
        tokenIncentive: 0,
        usdcIncentive: 0,
        tags: [],
        issueNumber: undefined,
        issueLink: undefined,
      };
    },
  },
});

export default newCreation.reducer;
export const selectCreation = (state: AppState) => state.creation;
export const { setStep1Data, setStep2Data, reset } = newCreation.actions;
