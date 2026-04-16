import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Dashboard() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check user authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        // If no token exists, redirect the user back to the login page immediately
        if (!token) {
            navigate("/login");
            return;
        }
        
        // Populate local user state for greeting
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    // Handles the submission of the user's debate prompt
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent empty submissions
        if (!prompt.trim()) {
            toast.error("Please enter a prompt!");
            return;
        }

        setLoading(true);
        setResponse(null); // Clear previous response when sending a new one
        
        try {
            const token = localStorage.getItem("token");
            
            // POST request to backend containing the prompt
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai/ask`,
                { prompt },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const rawText = res.data.response;
            let parsedData = null;

            try {
                // Try parsing structural JSON responses.
                // We strip out any Markdown code block wrapping (```json ... ```) 
                // because the AI sometimes formats JSON text with markdown syntax.
                const jsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
                parsedData = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Could not parse AI response as JSON, displaying raw text.", e);
            }

            // If successfully parsed into JSON, set the object to state.
            // Otherwise, wrap the raw string in an object so we can render text gracefully block.
            if (parsedData) {
                setResponse(parsedData);
            } else {
                setResponse({ raw: rawText });
            }

            // Clear the input field after successful submission
            setPrompt("");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to fetch response from AI");
            setResponse({ raw: "Sorry, an error occurred while connecting to the oracle." });
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main structural wrapper optimized for a light theme setting.
        <div className="min-h-[calc(100vh-58px)] p-6 md:p-12 relative overflow-hidden bg-white text-gray-900">
            {/* Background design element - subtle green blur for visual flair */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                        Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{user?.username || "Commander"}</span>
                    </h1>
                    <p className="text-gray-600 text-lg">Your AI co-pilot is ready. What do you want to explore today?</p>
                </header>

                {/* Input Form Card */}
                {/* Notice that this div encapsulates ONLY the prompt UI, keeping the response completely separate */}
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-xl mb-8">
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="State your argument..."
                            className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 text-lg placeholder-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-4 rounded-2xl font-medium tracking-wide transition-all duration-300
                                     bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg 
                                     hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-w-[160px] cursor-pointer"
                        >
                            {loading ? (
                                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                            ) : (
                                "Debate"
                            )}
                        </button>
                    </form>
                </div>

                {/* Response Container - Fully separated from the Input scope above */}
                <div className="w-full">
                    {loading ? (
                        // Render Loading State outside input
                        <div className="flex flex-col min-h-[200px] items-center justify-center text-gray-500 space-y-4">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-emerald-500 rounded-full animate-spin"></div>
                            <p className="animate-pulse font-medium">Consulting the oracle...</p>
                        </div>
                    ) : response ? (
                        response.raw ? (
                            // Fallback UI rendering if parsing returned raw text string
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md prose max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed overflow-x-auto">{response.raw}</pre>
                            </div>
                        ) : (
                            // Successful JSON Rendering matching AI payload format
                            <div className="space-y-6">
                                
                                {/* Row 1: Debate Analytics & Scores */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-emerald-600 mb-1">{response.score?.clarity || 0}/10</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Clarity</div>
                                    </div>
                                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">{response.score?.logic || 0}/10</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Logic</div>
                                    </div>
                                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">{response.score?.evidence_quality || 0}/10</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Evidence</div>
                                    </div>
                                </div>
                                
                                {/* Row 2: Head-to-Head Comparison */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* User's Context Card */}
                                    <div className="bg-white border border-red-200 shadow-sm rounded-xl p-6 border-l-4 border-l-red-500 relative overflow-hidden">
                                        <h3 className="text-sm text-red-600 uppercase tracking-wider font-bold mb-3">Your Stance</h3>
                                        <p className="text-gray-800 text-base leading-relaxed">{response.detected_user_stance}</p>
                                    </div>
                                    
                                    {/* AI's Counter-Stance Card */}
                                    <div className="bg-white border border-teal-200 shadow-sm rounded-xl p-6 border-l-4 border-l-teal-500 relative overflow-hidden">
                                        <h3 className="text-sm text-teal-600 uppercase tracking-wider font-bold mb-3">AI Position</h3>
                                        <p className="text-gray-800 text-base leading-relaxed">{response.ai_position}</p>
                                    </div>
                                </div>

                                {/* Row 3: Primary AI Argument Component */}
                                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 transition-shadow hover:shadow-md">
                                    <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        Debate Response
                                    </h3>
                                    {/* Render natural language text clearly visible against light theme */}
                                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">{response.response}</p>
                                </div>

                                {/* Row 4: Actionable Criticism provided to the user */}
                                <div className="bg-purple-50 border border-purple-200 shadow-sm rounded-xl p-6 border-l-4 border-l-purple-500">
                                    <h3 className="text-sm text-purple-700 uppercase tracking-wider font-bold mb-3">Constructive Feedback</h3>
                                    <p className="text-gray-800 text-base leading-relaxed italic border-l-2 border-purple-300 pl-4">"{response.feedback}"</p>
                                </div>
                                
                            </div>
                        )
                    ) : (
                        // Empty Initial Screen - Prompts user to start interacting
                        <div className="flex flex-col min-h-[200px] items-center justify-center text-gray-400 mt-12">
                            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-lg">Submit a premise to begin the debate...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
