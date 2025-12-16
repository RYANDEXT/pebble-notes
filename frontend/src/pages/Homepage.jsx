import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import NoteCard from '../components/NoteCard';
import NotesNotFound from '../components/NotesNotFound';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotes } from '../redux/slices/notesSlice';

const Homepage = () => {
    const notes = useSelector((state) => state.notes.items);
    const status = useSelector((state) => state.notes.status);
    const isLoading = useSelector((state) => state.notes.isLoading);
    const isRateLimited = useSelector((state) => state.notes.isRateLimited);
    console.log(notes);

    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllNotes());
        }
    }, [status, dispatch]);

    return (
        <div className="min-h-screen">
            <Navbar />
            {isRateLimited && <RateLimitedUI />}
            <div className="max-w-7xl mx-auto p-4 mt-6">
                {status === 'loading' && (
                    <div className="text-center text-primary py-10">
                        Loading notes...
                    </div>
                )}

                {notes.length === 0 && !isRateLimited && <NotesNotFound />}

                {notes.length > 0 && !isRateLimited && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map((note) => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;
