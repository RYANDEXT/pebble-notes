import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Perubahan Utama: Import Redux Hooks dan Thunk ---
import { useDispatch } from 'react-redux';
import { createNote } from '../redux/slices/notesSlice';
// Asumsi path ke notesSlice adalah '../store/notes/notesSlice'

const CreatePage = () => {
    // State lokal untuk form tetap dipertahankan
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch(); // Inisialisasi hook useDispatch

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Title and Content are required');
            return;
        }

        setLoading(true);

        try {
            // --- Ganti api.post dengan dispatch(createNote) ---
            const newNoteData = { title, content };

            // 1. Dispatch Thunk createNote dengan data baru.
            // 2. Gunakan .unwrap() untuk menunggu hasil Thunk dan menangkap error (rejected).
            await dispatch(createNote(newNoteData)).unwrap();

            // Jika berhasil, Thunk sudah menambahkan catatan ke state global.
            toast.success('Note Created Successfully');
            navigate('/');
        } catch (error) {
            // Error handling (termasuk rate limit) sudah dipindahkan ke notesSlice.js
            console.log('Error creating note handled by Redux:', error);
            // Kita tidak perlu menampilkan toast error spesifik di sini, karena sudah diurus di slice.
        } finally {
            setLoading(false);
        }
    };

    // ... (rest of the JSX remains the same)
    return (
        <div className="min-h-screen bg-base-100 mt-6">
            <div className="max-w-2xl mx-auto">
                <Link to={'/'} className="btn btn-ghost rounded-full mb-6">
                    <ArrowLeftIcon className="size-5" />
                    Back to Notes
                </Link>
                <div className="card bg-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">
                            Create New Note
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Note Title"
                                    className="input input-bordered"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Content</span>
                                </label>
                                <textarea
                                    placeholder="Write your note here..."
                                    className="textarea textarea-bordered h-32 resize-none"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Crating...' : 'Create Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePage;
