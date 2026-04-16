import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Sparkles, History, Send, Cpu, MessageSquare, Scale, BookOpen, AlertTriangle, Database } from "lucide-react";

function Dashboard() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [personality, setPersonality] = useState("Standard");
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    // Framer Motion Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    // Check user authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (!token) {
            navigate("/login");
            return;
        }
        
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    // Fetch debate history
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ai/history`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setHistory(res.data)).catch(console.error);
        }
    }, [response]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!prompt.trim()) {
            toast.error("Please enter a prompt!", { theme: "dark" });
            return;
        }

        setLoading(true);
        setResponse(null); 
        
        try {
            const token = localStorage.getItem("token");
            const currentPrompt = prompt;
            
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/ai/ask`,
                { prompt: currentPrompt, personality },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const rawText = res.data.response;
            let parsedData = null;

            try {
                const jsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
                parsedData = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Could not parse AI response as JSON, displaying raw text.", e);
            }

            if (parsedData) {
                setResponse(parsedData);
            } else {
                setResponse({ raw: rawText });
            }

            setPrompt("");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || "Failed to fetch response from AI", { theme: "dark" });
            setResponse({ raw: "Critical system failure. Link to oracle severed." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-58px)] p-6 md:p-12 relative overflow-hidden bg-dark-bg text-gray-100 font-sans">
            
            {/* Animated Background Orbs */}
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neon-primary/10 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-neon-secondary/10 rounded-full blur-[100px] animate-blob pointer-events-none" style={{animationDelay: "2s"}}></div>

            <motion.div 
                className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto relative z-10 w-full"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                
                {/* Sidebar for History */}
                <motion.div variants={itemVariants} className="w-full lg:w-1/3 xl:w-1/4 bg-glass-panel border border-glass-border rounded-3xl p-6 shadow-2xl h-auto lg:h-[calc(100vh-140px)] flex flex-col backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-700/50">
                        <History className="w-5 h-5 text-neon-secondary" />
                        <h2 className="text-xl font-bold text-gray-100 tracking-wide">Nexus Log</h2>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-500 opacity-60">
                                <Database className="w-8 h-8 mb-2" />
                                <p className="text-sm italic">No records found.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                <AnimatePresence>
                                    {history.map((item, i) => (
                                        <motion.li 
                                            key={item._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:bg-gray-700/60 hover:border-gray-600 transition-all cursor-pointer group"
                                            onClick={() => {
                                                try {
                                                    setResponse(JSON.parse(item.response));
                                                } catch(e) {
                                                    setResponse({ raw: item.response });
                                                }
                                                setPersonality(item.personality || "Standard");
                                            }}
                                        >
                                            <p className="text-sm font-medium text-gray-200 line-clamp-2 leading-snug mb-2 group-hover:text-neon-secondary transition-colors">{item.prompt}</p>
                                            <div className="flex items-center gap-1.5 mt-2">
                                                <Cpu className="w-3 h-3 text-neon-primary" />
                                                <span className="text-[10px] text-neon-primary uppercase tracking-widest font-bold">
                                                    {item.personality || "Standard"}
                                                </span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        )}
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex-1 max-w-4xl flex flex-col">
                    {/* Header Section */}
                    <motion.header variants={itemVariants} className="mb-10 text-center lg:text-left pt-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-white">
                            Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-primary to-neon-secondary">Sequence, {user?.username || "Commander"}</span>
                        </h1>
                        <p className="text-gray-400 text-lg flex items-center justify-center lg:justify-start gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500/80" /> The neural network awaits your hypothesis.
                        </p>
                    </motion.header>

                    {/* Input Form Card */}
                    <motion.div variants={itemVariants} className="bg-glass-panel backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-8">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Personality Selector */}
                                <div className="relative group/select">
                                    <select 
                                        value={personality} 
                                        onChange={(e) => setPersonality(e.target.value)}
                                        className="appearance-none w-full md:w-auto pl-10 pr-12 py-4 bg-gray-900/50 border border-gray-700/80 rounded-2xl text-gray-200 outline-none focus:bg-gray-800 transition-all font-semibold tracking-wide cursor-pointer focus:ring-2 focus:ring-neon-primary/40 focus:border-neon-primary"
                                        disabled={loading}
                                    >
                                        <option value="Standard" className="bg-gray-900">Standard Base</option>
                                        <option value="Aggressive" className="bg-gray-900 text-red-400">Aggressive</option>
                                        <option value="Philosophical" className="bg-gray-900 text-purple-400">Philosophical</option>
                                        <option value="Sarcastic" className="bg-gray-900 text-yellow-400">Sarcastic</option>
                                    </select>
                                    <BrainCircuit className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-primary pointer-events-none" />
                                </div>

                                {/* Main Input */}
                                <div className="relative flex-1 group/input">
                                    <input
                                        type="text"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Establish your operational premise..."
                                        className="w-full pl-6 pr-6 py-4 bg-gray-900/40 border border-gray-700/80 rounded-2xl text-gray-100 placeholder-gray-500 outline-none transition-all duration-300 focus:bg-gray-800/80 focus:border-neon-secondary focus:ring-2 focus:ring-neon-secondary/20 shadow-inner"
                                        disabled={loading}
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-4 rounded-2xl font-bold tracking-widest transition-all duration-300
                                             bg-gradient-to-r from-neon-primary to-emerald-400 text-gray-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]
                                             hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center min-w-[140px] cursor-pointer"
                                    style={{ textShadow: "0 1px 2px rgba(255,255,255,0.3)" }}
                                >
                                    {loading ? (
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                            <Cpu className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>EXECUTE</span>
                                            <Send className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Response Area */}
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div 
                                key="loader"
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, filter: "blur(10px)" }}
                                className="flex flex-col min-h-[300px] items-center justify-center bg-glass-panel border border-glass-border rounded-3xl p-12 shadow-2xl backdrop-blur-md"
                            >
                                <motion.div 
                                    className="w-24 h-24 relative flex items-center justify-center"
                                    animate={{ rotate: 360 }} 
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                >
                                    {/* Orbital rings */}
                                    <div className="absolute inset-0 border-2 border-t-neon-primary border-r-transparent border-b-neon-secondary border-l-transparent rounded-full opacity-70"></div>
                                    <motion.div 
                                        className="absolute inset-2 border border-dashed border-gray-500 rounded-full"
                                        animate={{ rotate: -360 }} 
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    ></motion.div>
                                    <BrainCircuit className="w-8 h-8 text-white animate-pulse" />
                                </motion.div>
                                <motion.h3 
                                    className="mt-8 text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    Compiling Rebuttal
                                </motion.h3>
                                <p className="text-gray-500 text-sm mt-2 font-mono tracking-wider">Neural networks are analyzing premise vectors...</p>
                            </motion.div>
                        ) : response && (
                            <motion.div 
                                key="response"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="w-full"
                            >
                                {response.raw ? (
                                    <div className="bg-glass-panel border border-glass-border rounded-3xl p-8 shadow-2xl backdrop-blur-md prose prose-invert max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-gray-200 leading-relaxed overflow-x-auto bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">{response.raw}</pre>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        
                                        {/* Row 1: Debate Analytics & Scores */}
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { label: "Clarity", val: response.score?.clarity, color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
                                                { label: "Logic", val: response.score?.logic, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
                                                { label: "Evidence", val: response.score?.evidence_quality, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5" }
                                            ].map((score, idx) => (
                                                <motion.div 
                                                    key={idx}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: idx * 0.1 + 0.2 }}
                                                    className={`hover:bg-gray-800 transition-colors border ${score.border} ${score.bg} shadow-lg rounded-2xl p-5 text-center flex flex-col items-center justify-center`}
                                                >
                                                    <div className={`text-4xl font-extrabold ${score.color} mb-1 drop-shadow-md`}>{score.val || 0}<span className="text-xl text-gray-600">/10</span></div>
                                                    <div className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">{score.label}</div>
                                                </motion.div>
                                            ))}
                                        </div>
                                        
                                        {/* Row 2: Head-to-Head Comparison */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <motion.div 
                                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                                                className="bg-gray-900/60 border border-gray-700/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/80 group-hover:w-2 transition-all"></div>
                                                <h3 className="text-xs text-red-400/80 uppercase tracking-widest font-black mb-3 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4" /> Hostile Premise
                                                </h3>
                                                <p className="text-gray-200 text-base leading-relaxed">{response.detected_user_stance}</p>
                                            </motion.div>
                                            
                                            <motion.div 
                                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                                                className="bg-gray-900/60 border border-gray-700/50 shadow-xl rounded-2xl p-6 relative overflow-hidden group"
                                            >
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-secondary/80 group-hover:w-2 transition-all"></div>
                                                <h3 className="text-xs text-neon-secondary/80 uppercase tracking-widest font-black mb-3 flex items-center gap-2">
                                                    <Scale className="w-4 h-4" /> AI Counter-Stance
                                                </h3>
                                                <p className="text-gray-200 text-base leading-relaxed">{response.ai_position}</p>
                                            </motion.div>
                                        </div>

                                        {/* Row 3: Primary AI Argument Component */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                            className="bg-glass-panel border border-glass-border shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-3xl p-8 lg:p-10 relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-primary via-neon-secondary to-purple-500 origin-left"></div>
                                            <h3 className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-3">
                                                <MessageSquare className="w-5 h-5 text-neon-primary" />
                                                Constructed Argument
                                            </h3>
                                            <p className="text-gray-100 whitespace-pre-wrap leading-loose text-lg font-medium">{response.response}</p>
                                        </motion.div>

                                        {/* Row 4: Actionable Criticism */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                                            className="bg-purple-900/10 border border-purple-500/20 shadow-lg rounded-2xl p-6 lg:p-8 relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                                            <h3 className="text-xs text-purple-400 uppercase tracking-widest font-black mb-4 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" /> System Feedback
                                            </h3>
                                            <p className="text-gray-300 text-base leading-relaxed italic bg-purple-900/20 p-4 rounded-xl border border-purple-800/30">
                                                "{response.feedback}"
                                            </p>
                                        </motion.div>
                                        
                                    </div>
                                )}
                            </motion.div>
                        )}
                        
                        {!loading && !response && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                                className="flex flex-col items-center justify-center h-[300px] text-gray-500 mt-4"
                            >
                                <BrainCircuit className="w-16 h-16 mb-6 opacity-20" />
                                <p className="text-lg font-light tracking-wide">Awaiting your tactical premise...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default Dashboard;
