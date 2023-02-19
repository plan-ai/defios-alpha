import { createUserMappingAPI } from '@/lib/helpers/api'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { resolve } from 'path'
import { AppState } from '../rootReducer'

export interface UserMappingType {
    bump: number
    nameRouter: string
    userName: string
    userPubkey: string
}

export interface UserMappingState {
    userMapping: UserMappingType | null;
    isLoading: boolean;
    error: string | undefined;
    isError: boolean;
}

const initialState: UserMappingState = {
    userMapping: null,
    isLoading: false,
    error: undefined,
    isError: false,
}

export const getUserMapping = createAsyncThunk(
    'userMapping/getUserMapping',
    async ({ userPubkey, accessToken, userID }: {
        userPubkey: string,
        accessToken: string,
        userID: string
    }, thunkAPI) => {
        return new Promise<UserMappingType>((resolve, reject) => {
            createUserMappingAPI(userPubkey, accessToken, userID).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            })
        })
    }
)

export const userMappingSlice = createSlice({
    name: 'userMapping',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserMapping.pending, (state) => {
            state.isLoading = true
            state.isError = false
        })
        builder.addCase(getUserMapping.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.userMapping = action.payload
        })
        builder.addCase(getUserMapping.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.error = action.error.message
        })
    }
})

export default userMappingSlice.reducer
export const selectUserMapping = (state: AppState) => state.userMapping
