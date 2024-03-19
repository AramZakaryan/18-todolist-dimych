import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/todolists-api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios";

// const initialState = {
//     isLoggedIn: false
// }

const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state,
                        action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

export const authReducer = slice.reducer

export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// actions

// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)


////////// Thunks

export const loginTC = createAsyncThunk("auth/login",
    (data: LoginParamsType, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        return authAPI.login(data)
            .then(res => {
                if (res.data.resultCode === 0) {
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {isLoggedIn: true}
                    // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
                } else {
                    handleServerAppError(res.data, thunkAPI.dispatch)
                    return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
                }
            })
            .catch((error: AxiosError) => {
                handleServerNetworkError(error, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
            })
    })

// export const _loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status:'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value:true}))
//                 dispatch(setAppStatusAC({status:'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                // dispatch(clearTodolistsAC())
                // dispatch(cleatTasksAC())
                dispatch(clearTasksAndTodolists())
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types

// type ActionsType = ReturnType<typeof setIsLoggedInAC>
// type InitialStateType = {
//     isLoggedIn: boolean
// }

