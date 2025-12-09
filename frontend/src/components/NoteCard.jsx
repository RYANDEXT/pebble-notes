import { Link } from 'react-router';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from '../lib/utils';
import ModalNote from './ModalNote';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note }) => {
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?'))
            return;

        try {
            await api.delete(`/notes/${id}`);
            toast.success('Note deleted successfully');
        } catch (error) {
            console.log('error deleting note', error);
            toast.error('Failed to delete note');
        }
    };

    return (
        <div>
            <Link
                to={`/note/${note._id}`}
                className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#73a5f5]"
            >
                <div className="card-body">
                    <h3 className="card-title text-base-content">
                        {note.title}
                    </h3>
                    <p className="text-base-content/70 line-clamp-3">
                        {note.content}
                    </p>
                    <div className="card-actions justify-between items-center mt-4">
                        <span className="text-sm text-base-content/60">
                            {formatDate(new Date(note.createdAt))}
                        </span>
                    </div>
                </div>
            </Link>
            <div className="flex justify-end items-center gap-1">
                <button
                    onClick={() =>
                        document.getElementById(note._id).showModal()
                    }
                >
                    <PenSquareIcon className="size-4" />
                </button>
                <button
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => handleDelete(note._id)}
                >
                    <Trash2Icon className="size-4" />
                </button>
                <ModalNote note={note} />
            </div>
        </div>
    );
};

export default NoteCard;
