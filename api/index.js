const express = require("express");
const cors = require("cors");
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const port = 4000;

const config = new Configuration({
    organization: "org-t2jndfDjhw0g6mCXrCSiRfev",
    apiKey: process.env.OPEN_AI_API_KEY,
  });
  const openai = new OpenAIApi(config);
  
  // console.log(process.env.MONGO_URL)
  
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:5173",
    })
  );

  app.get("/api/test", (req, res) => {

    res.json("Test Ok");
  });

  // Post details for AI prompt to generate a resume Sample
app.post("/api/generate-resume", async (req, res) => {
    try {
      const { prompt } = req.body;
  
      const generatedResume = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 3000,
      });
  
      const resumeText = generatedResume.data.choices[0].text.trim();
  
      res.json({ resume: resumeText });
    } catch (error) {
      console.error("Failed to generate resume:", error);
      res.status(500).json({ error: "Failed to generate resume" });
    }
  });
  app.listen(port);