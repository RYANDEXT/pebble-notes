import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
    return (
        <header className="max-w-96 mx-auto mt-5 rounded-full bg-base-300 border-b border-base-content/10">
            <div className="mx-auto py-4 px-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
                        Pebble
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link
                            to={'/create'}
                            className="btn btn-primary rounded-full"
                        >
                            <PlusIcon className="size-5" />
                            <span>New Note</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
