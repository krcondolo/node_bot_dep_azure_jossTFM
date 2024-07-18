require('dotenv').config();
const express = require('express');
const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');
const { sqlConfig } = require('./config');
const sql = require('mssql');
const { MyBot } = require('./bot'); // Importar el bot

const app = express();
const port = process.env.PORT || 3000;

// Crear el adaptador sin autenticación
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Crear almacenamiento de estados
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Inicializar el bot
const myBot = new MyBot(conversationState, userState);

// Middleware para manejar las solicitudes
app.post('/api/messages', async (req, res) => {
    console.log('Actividad entrante:', req.body); // Imprimir la actividad entrante
    await adapter.processActivity(req, res, async (context) => {
        await myBot.run(context);
    });
});

// Ruta para manejar GET en la raíz
app.get('/', (req, res) => {
    res.send('El bot está funcionando correctamente.');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

// Configuración de la base de datos
sql.connect(sqlConfig).then(pool => {
    console.log('Conectado a la base de datos SQL Azure');
    // Aquí puedes realizar consultas a la base de datos
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});
