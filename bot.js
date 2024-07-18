const { ActivityHandler } = require('botbuilder');
const sql = require('mssql');

class MyBot extends ActivityHandler {
    constructor(conversationState, userState) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;

        this.onMessage(async (context, next) => {
            const userMessage = context.activity.text;

            // Consulta a la base de datos
            const request = new sql.Request();
            try {
                const result = await request.query(`SELECT Respuesta FROM data_bot WHERE Pregunta = '${userMessage}'`);

                if (result.recordset.length > 0) {
                    await context.sendActivity(result.recordset[0].Respuesta);
                } else {
                    await context.sendActivity("Lo siento, no tengo una respuesta para eso.");
                }
            } catch (err) {
                console.error('Error ejecutando la consulta:', err);
                await context.sendActivity("Hubo un error procesando tu solicitud.");
            }

            await next();
        });
    }
}

module.exports.MyBot = MyBot;
