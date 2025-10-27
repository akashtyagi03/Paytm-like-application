import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, LoaderCircle, AlertCircle } from 'lucide-react';

export function Signup() {
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/signup', {
                firstName,
                lastName,
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            // On success, navigate to the login page with a success message state
            navigate('/dashboard');
        } catch (err) {
            console.log("error is ", err);
            // setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Create an Account</h2>
                <p className="text-gray-500 text-center mb-6">Join us to get started.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="firstname"
                            value={firstName}
                            onChange={(e) => setFirstname(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:text-gray-700  focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="lastname"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:text-gray-700  focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:text-gray-700 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password (min. 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:text-gray-700 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>
                    {error && (
                        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <><UserPlus className="mr-2 h-5 w-5" /> Sign Up</>}
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

