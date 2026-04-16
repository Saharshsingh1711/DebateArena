const stats = [
  { n: "500+", l: "Topics" },
  { n: "24/7", l: "Available" },
  { n: "AI",   l: "Feedback" },
  { n: "Free", l: "Early Access" },
];

const team = [
  { initials: "AR", name: "Aryan Raj",    role: "Founder & Dev" },
  { initials: "MS", name: "Meera Shah",   role: "AI & Research" },
  { initials: "KV", name: "Kunal Verma",  role: "Design & UX" },
];

function About() {
  return (
    <div className="animate-fadeUp max-w-[780px] mx-auto px-8 py-20">

      <div className="text-[0.7rem] font-medium tracking-[2px] uppercase text-acc mb-2">
        About the project
      </div>

      <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] tracking-[2px]
                     leading-[1] mb-6 text-t1">
        BUILT FOR<br />STUDENTS WHO<br />THINK DEEPER
      </h2>

      <p className="text-t2 text-[0.92rem] leading-[1.8] mb-4">
        Debate sharpens the most important skills you can have — critical thinking,
        confidence, and the ability to communicate clearly under pressure.
        But great practice partners are hard to find.
      </p>
      <p className="text-t2 text-[0.92rem] leading-[1.8] mb-4">
        AI Debate Arena gives every student a tireless, intelligent opponent available anytime.
        Whether you're prepping for a competition or just want to think more clearly,
        we've built it for you.
      </p>

      <div className="grid grid-cols-4 gap-[1px] bg-white/5 border border-white/5
                      rounded-[12px] overflow-hidden my-10">
        {stats.map((s) => (
          <div key={s.l} className="bg-s1 py-6 px-4 text-center">
            <div className="font-display text-[2.2rem] text-acc tracking-[1px]">{s.n}</div>
            <div className="text-[0.72rem] text-t3 uppercase tracking-[1px] mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <hr className="border-none border-t border-white/[0.07] my-12" />

      <h3 className="font-display text-[1.6rem] tracking-[2px] mb-5 text-t1">THE TEAM</h3>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        {team.map((t) => (
          <div key={t.initials}
               className="bg-s2 border border-white/[0.07] rounded-[10px] p-5
                          flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-acc/10 flex-shrink-0
                            flex items-center justify-center text-[0.75rem]
                            font-medium text-[#8b7fff]">
              {t.initials}
            </div>
            <div>
              <h4 className="text-[0.85rem] font-medium text-t1">{t.name}</h4>
              <p className="text-[0.72rem] text-t2">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default About;