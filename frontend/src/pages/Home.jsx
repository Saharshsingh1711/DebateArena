import { useNavigate } from "react-router-dom";

const features = [
  { num: "01", title: "AI Opponent",    desc: "Argues any side of any topic with real, structured arguments — no easy wins." },
  { num: "02", title: "Live Scoring",   desc: "Instant feedback on logic, structure, and persuasion as you debate in real time." },
  { num: "03", title: "Topic Library",  desc: "Hundreds of fresh topics across ethics, economics, tech, and current affairs." },
  { num: "04", title: "Leaderboard",    desc: "Compete with peers. See who the top debater in your class actually is." },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeUp">

      <div className="hero-bg relative min-h-[calc(100vh-58px)] flex flex-col
                      items-center justify-center text-center px-8 pb-16 overflow-hidden">

        <div className="inline-flex items-center gap-2 bg-acc/10 border border-acc/25
                        text-[#8b7fff] text-[0.7rem] font-medium tracking-[1.5px] uppercase
                        px-[14px] py-[5px] rounded-full mb-8">
          <span className="w-[6px] h-[6px] rounded-full bg-acc animate-pulse2" />
          AI-Powered Learning
        </div>

        <h1 className="font-display text-[clamp(4rem,12vw,7.5rem)] leading-[0.92]
                       tracking-[2px] mb-6 text-t1">
          ARGUE.<br />
          <span className="text-acc">THINK.</span><br />
          <span className="text-acc2">WIN.</span>
        </h1>

        <p className="text-t2 text-base leading-[1.75] max-w-[420px] mb-10 font-normal">
          Practice debate with an AI opponent that pushes back, scores your logic,
          and makes you sharper — every single round.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate("/join-beta")}
            className="bg-white text-black border border-black px-7 py-3 rounded-[7px]
                       text-[0.88rem] font-medium cursor-pointer tracking-[0.3px]
                       transition-all duration-200 hover:bg-black hover:text-white hover:border-white hover:-translate-y-[2px]"
          >
            Reserve Your Spot
          </button>
          <button
            onClick={() => navigate("/about")}
            className="bg-transparent border border-white/10 text-t2 px-7 py-3
                       rounded-[7px] text-[0.88rem] cursor-pointer transition-all duration-200
                       hover:border-white/25 hover:text-t1"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-8 pb-20">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
                        gap-[1px] bg-white/5 border border-white/5 rounded-[14px] overflow-hidden">
          {features.map((f) => (
            <div
              key={f.num}
              className="bg-s1 p-7 transition-colors duration-200 hover:bg-s2"
            >
              <div className="font-display text-[2rem] text-acc tracking-[1px] mb-1">{f.num}</div>
              <h3 className="text-[0.88rem] font-medium mb-1 text-t1">{f.title}</h3>
              <p className="text-[0.8rem] text-t2 leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;