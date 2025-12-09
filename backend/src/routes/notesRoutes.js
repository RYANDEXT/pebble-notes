import express from 'express';
import {
    getAllNotes,
    createNode,
    updateNote,
    deleteNote,
    getNoteById,
} from '../controllers/notesControllers.js';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNode);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
