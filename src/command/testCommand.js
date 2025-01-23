import { InteractionResponseType } from 'discord-interactions';
import {getRandomEmoji} from "../services/emojiService.js";

export function handleTestCommand(req, res) {
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `hello world ${getRandomEmoji()}`,
        },
    });
}