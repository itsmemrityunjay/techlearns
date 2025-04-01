const functions = require("firebase-functions");
const axios = require("axios");

exports.chatWithGPT = functions.https.onRequest(async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message }
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${functions.config().openai.key}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("Error fetching AI response", error);
    res.status(500).json({ error: "Error fetching AI response" });
  }
});
