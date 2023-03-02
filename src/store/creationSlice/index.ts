import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';

export interface step1Props {
  projectName: string;
  ownerCut: number;
}
export interface step2Props {
  repoName: string;
  repoLink: string;
}

export interface tokenSpecsProps {
  tokenSymbol: string;
  tokenName: string;
  totalSupply: number;
  tokenIcon: string;
}

export interface step3Props {
  tokenSpecs: tokenSpecsProps;
  algorithm: string;
  distribution: any;
}

export interface creationState {
  step1: step1Props;
  step2: step2Props;
  step3: step3Props;
}

const initialState: creationState = {
  step1: {
    projectName: '',
    ownerCut: 0,
  },
  step2: {
    repoLink: '',
    repoName: '',
  },
  step3: {
    tokenSpecs: {
      tokenIcon: '',
      tokenName: '',
      totalSupply: 0,
      tokenSymbol: '',
    },
    algorithm: 'Repository creator',
    distribution: null,
  },
};

export const creationSlice = createSlice({
  name: 'creation',
  initialState,
  reducers: {
    setStep1Data: (state, action: PayloadAction<step1Props>) => {
      state.step1 = action.payload;
    },
    setStep2Data: (state, action: PayloadAction<step2Props>) => {
      state.step2 = action.payload;
    },
    setAlgo: (state, action: PayloadAction<string>) => {
      state.step3.algorithm = action.payload;
    },
    setDistribution: (state, action: PayloadAction<any>) => {
      state.step3.distribution = action.payload;
    },
    setStep3Data: (state, action: PayloadAction<tokenSpecsProps>) => {
      state.step3.tokenSpecs = action.payload;
    },
    reset: (state) => {
      state.step1 = {
        projectName: '',
        ownerCut: 0,
      };
      state.step2 = {
        repoLink: '',
        repoName: '',
      };
      state.step3 = {
        tokenSpecs: {
          tokenIcon: '',
          tokenName: '',
          totalSupply: 0,
          tokenSymbol: '',
        },
        algorithm: 'Repository creator',
        distribution: null,
      };
    },
  },
});

export default creationSlice.reducer;
export const selectCreation = (state: AppState) => state.creation;
export const {
  setStep1Data,
  setStep2Data,
  setStep3Data,
  setAlgo,
  setDistribution,
  reset,
} = creationSlice.actions;
