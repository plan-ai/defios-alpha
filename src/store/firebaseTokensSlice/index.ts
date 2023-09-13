import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '../rootReducer';
import axios from '@/lib/axiosClient';

export interface FirebaseTokensType {
  auth_creds: string | null;
  firebase: string | null;
}

export interface firebaseJwtApi {
  github_id: string;
  firebase_uid: string;
  user_gh_access_token: string;
  pub_key: string;
}

export interface FirebaseTokensState {
  firebaseTokens: FirebaseTokensType;
  isLoading: boolean;
  error: string | undefined;
  isError: boolean;
}

const initialState: FirebaseTokensState = {
  firebaseTokens: {
    firebase: null,
    auth_creds: null,
  },
  isLoading: false,
  error: undefined,
  isError: false,
};

export const getFirebaseJwt = createAsyncThunk(
  'firebaseTokens/getfirebaseJwt',
  async ({
    github_id,
    firebase_uid,
    user_gh_access_token,
    pub_key,
  }: firebaseJwtApi) => {
    return new Promise<FirebaseTokensType>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_DEFIOS_SERVER}/user/setup`, {
          github_id,
          firebase_uid,
          user_gh_access_token,
          pub_key,
        })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  }
);

export const firebaseTokensSlice = createSlice({
  name: 'firebaseTokens',
  initialState,
  reducers: {
    notifset: (state, action: PayloadAction<string>) => {
      state.firebaseTokens.firebase = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFirebaseJwt.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
    });
    builder.addCase(
      getFirebaseJwt.fulfilled,
      (state, action: PayloadAction<FirebaseTokensType>) => {
        state.isLoading = false;
        state.isError = false;
        state.firebaseTokens = action.payload;
      }
    );
    builder.addCase(getFirebaseJwt.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.error.message;
    });
  },
});

export default firebaseTokensSlice.reducer;
export const selectfirebaseTokens = (state: AppState) => state.firebaseTokens;
export const { notifset } = firebaseTokensSlice.actions;
