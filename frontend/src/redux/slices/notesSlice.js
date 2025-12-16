import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const initialState = {
    items: [],
    status: 'idle',
    error: null,
    isRateLimited: false,
    isLoading: false,
    isSaving: false,
};

// fetch all notes
export const fetchAllNotes = createAsyncThunk(
    'notes/fetchAllNotes',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/notes');
            return res.data;
        } catch (error) {
            if (error.response?.status === 429) {
                throw new Error('Rate Limited Fetch');
            }
            return rejectWithValue(
                error.response?.data?.message || 'Failed to load notes'
            );
        }
    }
);

// create note
export const createNote = createAsyncThunk(
    'notes/createNote',
    async (noteData, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.post('/notes', noteData);
            dispatch(noteAdded(res.data)); // Panggil reducer sinkronis
            return res.data;
        } catch (error) {
            if (error.response?.status === 429) {
                throw new Error('Rate Limited Create');
            }
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create note'
            );
        }
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ id, title, content }, { dispatch, rejectWithValue }) => {
        try {
            const res = await api.put(`/notes/${id}`, { title, content });
            dispatch(noteUpdated(res.data)); // Panggil reducer sinkronis
            return res.data;
        } catch (error) {
            if (error.response?.status === 429) {
                throw new Error('Rate Limited Update');
            }
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update note'
            );
        }
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (noteId, { dispatch, rejectWithValue }) => {
        try {
            await api.delete(`/notes/${noteId}`);
            dispatch(noteDeleted(noteId)); // Panggil reducer sinkronis
            return noteId;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete note'
            );
        }
    }
);

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        noteAdded: (state, action) => {
            state.items.unshift(action.payload);
        },
        noteUpdated: (state, action) => {
            const index = state.items.findIndex(
                (note) => note._id === action.payload._id
            );
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        noteDeleted: (state, action) => {
            state.items = state.items.filter(
                (note) => note._id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllNotes.pending, (state) => {
                state.status = 'loading';
                state.isRateLimited = false;
                state.isLoading = true;
            })
            .addCase(fetchAllNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchAllNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.isLoading = false;
                if (action.error.message === 'Rate Limited Fetch') {
                    state.isRateLimited = true;
                    state.error = 'You have exceeded the rate limit.';
                    setTimeout(() => {
                        state.isRateLimited = false;
                    }, 5000);
                } else {
                    state.error = action.payload || action.error.message;
                    toast.error(state.error);
                }
            })
            .addCase(createNote.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(createNote.fulfilled, (state) => {
                state.isSaving = false;
                toast.success('Note created successfully');
            })
            .addCase(createNote.rejected, (state, action) => {
                state.isSaving = false;
                if (action.error.message === 'Rate Limited Create') {
                    state.isRateLimited = true;
                    toast.error(
                        "Slow down buddy, you're creating notes too fast",
                        { duration: 4000, icon: '🐢' }
                    );
                    setTimeout(() => {
                        state.isRateLimited = false;
                    }, 5000);
                } else {
                    toast.error(action.payload || 'Failed to create note');
                }
            })
            .addCase(updateNote.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(updateNote.fulfilled, (state) => {
                state.isSaving = false;
                toast.success('Note updated successfully');
            })
            .addCase(updateNote.rejected, (state, action) => {
                toast.error(action.payload || 'Failed to update note');
                if (action.error.message === 'Rate Limited Update') {
                    toast.error('Slow down buddy, you might break the system', {
                        duration: 4000,
                        icon: '🐢',
                    });
                }
            })
            .addCase(deleteNote.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(deleteNote.fulfilled, (state) => {
                state.isSaving = false;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                toast.error(action.payload || 'Failed to delete note');
            });
    },
});

export const { noteAdded, noteUpdated, noteDeleted } = notesSlice.actions;
export default notesSlice.reducer;
