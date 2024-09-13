const PORT = 8000;
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors');
const OpenAI = require("openai");

//const { env } = require("process");


//Start the web framework express.js
const app = express();
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.json());

//Load the environment
dotenv.config();

//fetch data
//root
app.get('/', (req, res) => {
    res.json('I am your root from the node.js server')
});

let textReceived = 'Indraneel'

//getdata
app.get('/getdata', (req, res) => {
    let msg = `${textReceived}, I am your root data being passed to front-end from the node.js server`
    res.send({ 'text': msg })
});

//send data
app.post('/senddata', (req, res) => {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', req.headers);

    const receivedText = req.body.text;
    console.log('Received text:', receivedText);

    // Do something with the received text
    res.send({ data: `${receivedText} - Text received successfully!` });
    textReceived = receivedText
});


//OpenAI code -------------------------- ********************** --------------------------
const openai = new OpenAI({
    apiKey: process.env.Open_AI_API_KEY,
});

//just to see OpenAI is working
async function call_openai() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-4o",
    });

    console.log(completion.choices[0]);
}

//Create the openai_api_end_point
app.get("/queryai", async (req, res) => {
    let content = await call_openai();
    res.send(content);
});

//to interpret an image in openai
async function call_openai_translate_ASLGloss(englishSentence) {
    const ASLGloss = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: 'system',
                content: 'You are an assistant that converts simple English sentences into ASL Gloss (American Sign Language).'
            },
            {
                role: 'user',
                content: `Convert the following sentence to ASL Gloss: "${englishSentence}"`
            }
        ],
        max_tokens: 100,
        temperature: 0.2
    })
    console.log(ASLGloss.choices[0]);
}

//Create the openai_api_end_point
app.get("/translatetoASLGloss", async (req, res) => {
    let english = req.body;
    if (!english) {
        return res.status(400).json({ error: 'No value provided' });
    }
    let content = await call_openai_translate_ASLGloss(english);
    //res.send(content);
    res.json({ content });
});
