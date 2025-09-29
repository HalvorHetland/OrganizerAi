import React from 'react';
import { GraduationCapIcon } from './IconComponents';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="flex items-center mb-4">
                        <GraduationCapIcon className="h-12 w-12 text-custom-primary-light" />
                        <h1 className="ml-3 text-4xl font-bold text-gray-800 dark:text-white">Organizer AI</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Your smart student assistant.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input 
                                id="email-address" 
                                name="email" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-custom-primary-light focus:border-custom-primary-light focus:z-10 sm:text-sm" 
                                placeholder="Email address"
                                defaultValue="me@university.edu"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                autoComplete="current-password" 
                                required 
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-custom-primary-light focus:border-custom-primary-light focus:z-10 sm:text-sm" 
                                placeholder="Password"
                                defaultValue="password123"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-custom-primary hover:bg-custom-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-primary-light">
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;