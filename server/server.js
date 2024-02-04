import  express from "express"; 
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

let userNameSession = {};

app.get('/', async (req, res) =>{
    res.status(200).send({
        message: 'Hello World'
    })
});


app.post('/saveUserName', (req, res) => {
  const { userId, name, metodoAutenticacion } = req.body;

  // Guardar el nombre y el método de autenticación en el objeto de sesión
  userNameSession[userId] = { nombre: name, metodoAutenticacion: metodoAutenticacion };

  res.status(200).send({ message: 'Nombre guardado con éxito' });
});


app.post('/', async (req, res) =>{
    try {
        const promt = req.body.promt;  
        const userId = req.body.userId; 

        const userData = userNameSession[userId] || {};
        const userName = userData.nombre;

        const response = await openai.chat.completions.create({
          model: "gpt-4-1106-preview",
          messages: [
            
            {"role": "system", "content": `You are an emotional assistant focused on anxiety as the main 
            issue, as well as emotional problems stemming from anxiety, including symptoms, feelings, and 
            insecurities. You will use all this information according to the situation presented by the user.
            Do not be too insistent with questions in every interaction; proceed step by step as a psychologist
            would, trying to help. If the user already provides context about what is happening to them, offer 
            them a maximum of 3 pieces of advice on how to deal with it; don't just listen. Avoid repeating a 
            greeting in every message; do it only when the user gives you their name and on very specific occasions.
            Do not ask too much about their day or how they feel if they have already shared the problem. Instead, 
            seek to provide guidance rather than pressuring them with more questions (IMPORTANT).
        
            If the user enters something other than their name or something unrelated to anxiety or emotional problems,
            respond that you cannot answer questions not related to anxiety. If it is the first time they enter their 
            name, input it yourself. Say your name, that you are a support for facing anxiety, only if it is the first
            time and they provide a valid name. Your name is PSCYAI. You will only mention your name when necessary;
            do not repeat it constantly; only when the user enters their name or at very specific and important moments
            to use the name.
            
            If they speak to you in Spanish, respond in Spanish; if they speak in English, respond in English. After the 
            first message, only ask how their day is going and how they feel in the first message they send you. Especially 
            ensure not to greet constantly; only do it when the user enters the app and when they give you their name at the 
            beginning, do not greet afterward. Please don't say hello in every message, and give answers that are not so long,
            the goal is not to cut off the message you are going to send. The user's name is: ${userName}. `
        },
              {"role": "user", "content": `${promt}`}   
          ],
          temperature: 1,
          max_tokens: 200,
          top_p: 1,
          frequency_penalty: 0,                       
          presence_penalty: 0,
        });
        
        res.status(200).send({
          bot: response.choices[0].message,  
          userName: userName, 
          metodoAutenticacion: userData.metodoAutenticacion || 'normal',
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
});
app.listen(3000, ()=> console.log('Server is running on port http://localhost:3000'))

