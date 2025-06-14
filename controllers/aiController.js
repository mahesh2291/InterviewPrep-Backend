const {GoogleGenAI}=require('@google/genai')

const {conceptExplainPrompt, questionAnswerPrompt}=require("../utils/prompts")

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});


const generateInterviewQuestions = async (req, res) => {
    try {
      const { role, experience, topicsToFocus, numberOfQuestions } = req.body;
     
      if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }
  
      const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
          
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-lite',
          contents: prompt
        });
      } catch (genAiError) {
        console.error("Gemini API error:", genAiError.message);
        return res.status(500).json({ message: "Gemini AI failed", error: genAiError.message });
      }
      
      let rawText = response.text;
  
      // Clean the raw text
      const cleanedText = rawText
      .replace(/^```json\s*/, "")  
      .replace(/```$/, "")  
      .trim();
    
    const parsedData = JSON.parse(cleanedText);
    
    // Clean individual items for consistent formatting
    const sanitized = parsedData.map(item => ({
      question: item.question.trim(),
      answer: item.answer.replace(/\s*\n\s*/g, " ").trim() // Collapse unnecessary line breaks in answers
    }));
    console.log(sanitized)
    res.status(200).json(sanitized);
  
    } catch (err) {
      res.status(500).json({
        message: "Failed to generate questions",
        err: err.message
      });
    }
  };
  

const generateConceptExplaination=async(req,res)=>{
    try {
        const { question } = req.body;
  
        if (!question) {
          return res.status(400).json({
            message: "Missing question"
          });
        }
        const prompt = conceptExplainPrompt(question);
  
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-lite',
          contents: prompt
        });
    
        let rawText = response.text;

    
        const cleanedText = rawText
  .replace(/^```json\s*/, "")  
  .replace(/```$/, "")  
  
  .trim();

const parsedData = JSON.parse(cleanedText);

// Clean individual items
const sanitized = {
  title: parsedData.title.trim(),
  explanation: parsedData.explanation.replace(/\s*\n\s*/g, " ").trim() // Ensures smooth formatting within explanation
};

res.status(200).json(sanitized);

        } catch (err) {
            res.status(500).json({
            
                message:"Failed to generate questions",
                err:err.message
            })
        }
}

module.exports={generateConceptExplaination,generateInterviewQuestions}