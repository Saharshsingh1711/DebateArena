import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function JoinBeta() {
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    school:    "",
    grade:     "",
    referral:  "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit() {
    if (!form.firstName || !form.email || !form.school || !form.grade) {
      setError("Fill all the fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Sahi email daalo.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/preregister`, form);
      toast.success("You're on the waitlist! ");
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeUp max-w-[540px] mx-auto px-8 py-20">

      <div className="text-[0.7rem] font-medium tracking-[2px] uppercase text-acc mb-2">
        Pre-register
      </div>

      <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-[2px] leading-[1] mb-2 text-t1">
        JOIN THE<br />WAITLIST
      </h2>
      <p className="text-t2 text-[0.92rem] leading-[1.8] mb-8">
        Be among the first to access AI Debate Arena. We'll reach out as soon as we launch.
      </p>

      <div className="bg-s2 border border-white/[0.07] rounded-[14px] p-8">
        {submitted ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-acc3/10 flex items-center
                            justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-acc3"
                   fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 className="font-display text-[1.5rem] tracking-[1px] mb-1 text-t1">YOU'RE IN!</h4>
            <p className="text-[0.82rem] text-t2">
              We'll email you the moment AI Debate Arena is live. Get ready to argue.
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-[0.9rem] font-medium mb-6 text-t1">Registration form</h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[0.72rem] font-medium text-t3
                                  uppercase tracking-[0.5px] mb-1">
                  First Name *
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Rahul"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[0.72rem] font-medium text-t3
                                  uppercase tracking-[0.5px] mb-1">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Sharma"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[0.72rem] font-medium text-t3
                                uppercase tracking-[0.5px] mb-1">
                Email *
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[0.72rem] font-medium text-t3
                                uppercase tracking-[0.5px] mb-1">
                School / College *
              </label>
              <input
                name="school"
                type="text"
                placeholder="Delhi Public School"
                value={form.school}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-[0.72rem] font-medium text-t3
                                uppercase tracking-[0.5px] mb-1">
                Grade *
              </label>
              <select
                name="grade"
                value={form.grade}
                onChange={handleChange}
              >
                <option value="">Select grade</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="College / University">College / University</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-[0.72rem] font-medium text-t3
                                uppercase tracking-[0.5px] mb-1">
                Referral Code (optional)
              </label>
              <input
                name="referral"
                type="text"
                placeholder="Friend ka code daalo"
                value={form.referral}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-acc2 text-[0.82rem] mb-3">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-2 bg-acc text-black border-none rounded-[7px]
                         py-3 text-[0.88rem] font-medium cursor-pointer tracking-[0.3px]
                         transition-all duration-200 hover:bg-[#6d60ff] hover:text-white
                         active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Reserve My Spot →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinBeta;
