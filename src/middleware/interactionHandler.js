import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {commandHandlers} from "./commandHandler.js";

export async function interactionHandler(req, res) {
    const { type, data } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        const handler = commandHandlers[name];

        if (handler) {
            return handler(req, res);
        }

        console.error(`unknown command: ${name}`);
        return res.status(400).json({ error: 'unknown command' });
    }

    console.error('unknown interaction type', type);
    return res.status(400).json({ error: 'unknown interaction type' });
}