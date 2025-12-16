import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isLoading: false,
        isSaving: false,
    },
    reducers: {
        setGlobalLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setGlobalSaving: (state, action) => {
            state.isSaving = action.payload;
        },
    },
});

export const { setGlobalLoading, setGlobalSaving } = uiSlice.actions;
export default uiSlice.reducer;
