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
            const result = await request.query(`SELECT respuesta FROM preguntas WHERE pregunta = '${userMessage}'`);

            if (result.recordset.length > 0) {
                await context.sendActivity(result.recordset[0].respuesta);
            } else {
                await context.sendActivity("Lo siento, no tengo una respuesta para eso.");
            }

            await next();
        });
    }
}

module.exports.MyBot = MyBot;
