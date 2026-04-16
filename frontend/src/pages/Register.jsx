import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.username || !form.email || !form.password) {
            toast.error("Please fill all fields!");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
                form
            );
            toast.success("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-58px)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-acc/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-bg/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-display font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-acc to-purple-400 mb-6 text-center">
                        Create Account
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-t2 mb-1.5 ml-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Choose a username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-t1 placeholder-t2/50 outline-none transition-all duration-200 focus:border-acc/50 focus:bg-white/10 focus:ring-1 focus:ring-acc/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-t2 mb-1.5 ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-t1 placeholder-t2/50 outline-none transition-all duration-200 focus:border-acc/50 focus:bg-white/10 focus:ring-1 focus:ring-acc/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-t2 mb-1.5 ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-t1 placeholder-t2/50 outline-none transition-all duration-200 focus:border-acc/50 focus:bg-white/10 focus:ring-1 focus:ring-acc/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-6 rounded-xl font-medium tracking-wide transition-all duration-300 transform active:scale-[0.98]
                                     bg-gradient-to-r from-acc to-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.3)] 
                                     hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                "Join the Arena"
                            )}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-center text-sm text-t2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-acc hover:text-emerald-300 transition-colors duration-200">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;