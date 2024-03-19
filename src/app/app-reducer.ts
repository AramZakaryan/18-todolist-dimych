import {authAPI} from '../api/todolists-api'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";

export const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}


const slice = createSlice({
    name: "app",
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppErrorAC(state,
                      action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        // setAppInitializedAC(state,
        //                     action: PayloadAction<{ value: boolean }>) {
        //     state.isInitialized = action.payload.value
        // },
        setAppStatusAC(state,
                       action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        }
    },
    extraReducers: builder => {
        builder
            .addCase(initializeAppTC.fulfilled, (state) => {
                state.isInitialized = true
            })
    }
})

export const appReducer = slice.reducer

export const {
    setAppErrorAC,
    setAppStatusAC,
    // setAppInitializedAC
} = slice.actions


//////////// THUNKS
export const initializeAppTC = createAsyncThunk("app/initializeApp",
    async (_, {dispatch}) => {
        const res = await authAPI.me();
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
        }
        // return
        // dispatch(setAppInitializedAC({value: true}));
    })
// export const _initializeAppTC = () => (dispatch: Dispatch) => {
//     authAPI.me().then(res => {
//         if (res.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC({isLoggedIn: true}));
//         } else {
//
//         }
//         dispatch(setAppInitializedAC({value: true}));
//     })
// }


// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-IS-INITIALIED':
//             return {...state, isInitialized: action.value}
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         default:
//             return {...state}
//     }


// }
// export type InitialStateType = {
//     // происходит ли сейчас взаимодействие с сервером
//     status: RequestStatusType
//     // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
//     error: string | null
//     // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
//     isInitialized: boolean

// }
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIED', value} as const)

// type ActionsType =
//     | SetAppErrorActionType
//     | SetAppStatusActionType
//     | ReturnType<typeof setAppInitializedAC>

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>


