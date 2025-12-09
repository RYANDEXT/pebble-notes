import { Route, Routes } from 'react-router';
import HomePage from './pages/Homepage';
import CreatePage from './pages/CreatePage';
import NoteDetailPage from './pages/NoteDetailPage';

const App = () => {
    return (
        <div className="relative h-full w-full">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/note/:id" element={<NoteDetailPage />} />
            </Routes>
        </div>
    );
};

export default App;
