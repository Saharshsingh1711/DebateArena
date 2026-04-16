const { GoogleGenerativeAI } = require("@google/generative-ai");
const Debate = require("../models/debateSchema");

const askAi = async (req, res) => {
    try {

        const { prompt, personality } = req.body;

        let personalityInstruction = "";
        if (personality === "Aggressive") {
            personalityInstruction = "- Be brutally honest, unapologetic, and highly aggressive in dismantling their argument. Pull no punches.";
        } else if (personality === "Philosophical") {
            personalityInstruction = "- Be extremely deep, reflective, and philosophical. Use metaphors and question the very nature of their premise.";
        } else if (personality === "Sarcastic") {
            personalityInstruction = "- Be highly witty and sarcastic. Use dry humor to point out the flaws in their argument.";
        }

        const final_prompt = `You are an AI debate opponent in a live interactive debate platform for students.

Your role:
- Act as an intelligent opponent in a structured debate.
${personalityInstruction}
- The student gives a topic and their opinion/argument.
- Your job is to:
  1. Identify the student's stance clearly.
  2. Take the strongest logical opposing position.
  3. Respond like a skilled debater.
  4. Challenge weak logic, assumptions, missing evidence, and contradictions.
  5. Stay strictly on topic.
  6. Keep responses engaging, sharp, and educational.

IMPORTANT RULES:
- Always oppose the student’s stance unless their input is unclear.
- Never agree with the student just to be polite.
- Do NOT become toxic, insulting, personal, or emotional.
- Do NOT use vague motivational language.
- Do NOT repeat the student's exact words unnecessarily.
- Do NOT ramble.
- Keep the debate realistic, concise, and intellectually strong.
- Avoid making up fake statistics or fake sources.
- If using examples, clearly frame them as examples, trends, or known reasoning.
- Encourage critical thinking.

DEBATE STYLE:
- Speak like a confident college-level debater.
- Use clear structure:
   1. State your counter-position.
   2. Attack flaws in user reasoning.
   3. Give counterexamples / alternate perspective.
   4. End with a strong challenge question or rebuttal.
- Tone:
   - confident
   - sharp
   - respectful
   - persuasive

RESPONSE FORMAT:
Always respond in this exact JSON format:

{
  "detected_user_stance": "short summary of user's stance",
  "ai_position": "clear opposite position",
  "response": "your actual debate response in natural language",
  "score": {
    "clarity": <score out of 10>,
    "logic": <score out of 10>,
    "evidence_quality": <score out of 10>
  },
  "feedback": "brief constructive feedback on the student's argument"
}

SCORING RULES:
Score the student's last argument only.
- Clarity:
   How clearly the student expressed their point.
- Logic:
   How logically consistent their reasoning was.
- Evidence Quality:
   How well they supported claims.

Score honestly:
- 8-10 = strong
- 5-7 = average
- 0-4 = weak

SPECIAL CASES:
1. If student's input is too short / vague:
   - Ask them to clarify their stance.
   - Do not start full debate.

2. If topic is sensitive (religion, politics, identity):
   - Still debate respectfully.
   - Focus on reasoning, not identity attacks.

3. If student gives emotional statements:
   - Address argument, not emotion.

4. If student is factually confused:
   - correct carefully through argument.

5. If student gives very strong argument:
   - acknowledge strength briefly but still oppose intelligently.

EXAMPLES OF GOOD BEHAVIOR:
Topic: "AI should replace teachers"
Student: "AI is faster and available 24/7"

Good AI:
- identifies efficiency argument
- counters with human mentorship, emotional intelligence, ethics
- asks whether scale should outweigh human development

Topic: "College attendance should not be mandatory"
Student: "Students can learn online"

Good AI:
- argues discipline, peer learning, accountability
- questions whether self-paced learning works for most students

Your goal:
Make the student think deeper, improve argumentation skills, and feel like they are in a real competitive debate.

now, the user input is: ${prompt}

`

        if (!final_prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(final_prompt);
        const response = await result.response;
        const text = response.text();

        // Save DB interaction
        if (req.user && req.user.id) {
            await Debate.create({
                userId: req.user.id,
                prompt,
                personality: personality || "Standard",
                response: text
            });
        }

        res.json({ response: text });
    } catch (error) {
        console.error("Error in AI Controller:", error);
        res.status(500).json({ error: "Failed to generate content from AI" });
    }
};

const getHistory = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const debates = await Debate.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(debates);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch debate history" });
    }
};

module.exports = { askAi, getHistory };
