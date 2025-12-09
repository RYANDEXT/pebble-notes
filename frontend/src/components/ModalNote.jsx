import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const ModalNote = ({ note }) => {
    const [noteData, setNoteData] = useState(note);
    const [saving, setSaving] = useState(false);
    // const [isRateLimited, setIsRateLimited] = useState(false);

    const handleSubmit = async () => {
        if (!noteData.title.trim() || !noteData.content.trim()) {
            toast.error('Please add a title or content');
            return;
        }
        setSaving(true);

        try {
            await api.put(`/notes/${noteData._id}`, noteData);
            toast.success('Note updated successfully');
        } catch (error) {
            console.log('Error update the note', error);
            toast.error('Failed to update note');
        } finally {
            setSaving(false);
            document.getElementById(note._id).close();
        }
    };

    return (
        <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            {/* <button
                className="btn"
                onClick={() =>
                    document.getElementById('my_modal_5').showModal()
                }
            >
                open modal
            </button> */}
            <dialog id={note._id} className="modal modal-top sm:modal-middle">
                <div className="relative min-h-[50%] modal-box">
                    <input
                        type="text"
                        placeholder="Title"
                        className="bg-inherit focus:border-none focus:outline-none min-w-full max-w-xs mb-7 text-2xl"
                        value={noteData.title}
                        onChange={(e) =>
                            setNoteData({
                                ...noteData,
                                title: e.target.value,
                            })
                        }
                    />
                    <TextareaAutosize
                        value={noteData.content}
                        minRows={10}
                        maxRows={12}
                        onChange={(e) =>
                            setNoteData({
                                ...noteData,
                                content: e.target.value,
                            })
                        }
                        placeholder="Content"
                        className="overflow-y-hidden focus:outline-none p-0 bg-inherit resize-none text-sm min-w-full"
                    />
                    <div className="absolute bottom-0 right-0 modal-action m-3">
                        <button
                            className="btn btn-success"
                            disabled={saving}
                            onClick={handleSubmit}
                        >
                            {saving ? 'saving...' : 'Save'}
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={() =>
                                document.getElementById(note._id).close()
                            }
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ModalNote;
