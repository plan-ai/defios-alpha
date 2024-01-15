import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface step1Props {
  repoName: string;
  repoLink: string;
  repoId: string;
  selectedRepo: any;
  projectName: string;
  projectDescription: string;
  tokenSymbol: string;
  tokenName: string;
  tokenType: string;
  tokenAddress: string | undefined;
  tokenIcon: File | undefined;
  tokenImgLink: string;
}
export interface step2Props {
  issueType: 'create' | 'import';
  issueTitle: string;
  issueDescription: string;
  selectedIssue: any;
  tokenIncentive: number;
  tags: string[];
  issueNumber: number | undefined;
  issueLink: string | undefined;
}

export interface step4Props {
  repoLink: string;
  issueLink: string;
}

export interface creationState {
  step1: step1Props;
  step2: step2Props;
  step4: step4Props;
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
    tokenAddress: undefined,
    tokenType: '',
    tokenIcon: undefined,
    tokenImgLink: '',
  },
  step2: {
    issueType: 'create',
    issueTitle: '',
    issueDescription: '',
    selectedIssue: undefined,
    tokenIncentive: 0,
    tags: [],
    issueNumber: undefined,
    issueLink: undefined,
  },
  step4: {
    repoLink: '',
    issueLink: '',
  },
};

export const newCreation = createSlice({
  name: 'newCreation',
  initialState,
  reducers: {
    setStep1Data: (state, action: PayloadAction<step1Props>) => {
      state.step1 = action.payload;
    },
    setStep2Data: (state, action: PayloadAction<step2Props>) => {
      state.step2 = action.payload;
    },
    setStep4Data: (state, action: PayloadAction<step4Props>) => {
      state.step4 = action.payload;
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
        tokenAddress: undefined,
        tokenType: '',
        tokenIcon: undefined,
        tokenImgLink: '',
      };
      state.step2 = {
        issueType: 'create',
        issueTitle: '',
        issueDescription: '',
        selectedIssue: undefined,
        tokenIncentive: 0,
        tags: [],
        issueNumber: undefined,
        issueLink: undefined,
      };
      state.step4 = {
        repoLink: '',
        issueLink: '',
      };
    },
  },
});

export default newCreation.reducer;
export const selectCreation = (state: AppState) => state.newCreation;
export const { setStep1Data, setStep2Data, setStep4Data, reset } =
  newCreation.actions;
