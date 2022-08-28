import { Action, AnyAction, combineReducers, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import authSlice from "./slices/auth/authSlice";

const combinedReducer = combineReducers({
    auth: authSlice
});

const reducer: typeof combinedReducer = (state, action) => {
    switch (action.type) {
        case HYDRATE: {
            const nextState = {
                ...state, // use previous state
                ...action.payload // apply delta from hydration
            }

            return nextState
        }

        default: {
            return combinedReducer(state, action)
        }
    }
};

// Initialize store on each request to the server
export const makeStore = () => configureStore({ reducer });

// Needed Types
export type Store = ReturnType<typeof makeStore>;
export type AppDispatch = Store['dispatch'];
export type RootState = ReturnType<Store['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Wrapper
export const wrapper = createWrapper<Store>(makeStore, { debug: true });