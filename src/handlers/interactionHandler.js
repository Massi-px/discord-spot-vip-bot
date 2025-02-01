import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { commandHandlers } from './commandHandler.js';
import { getRoleOwnerByOwnerId } from '../models/roleService.js';
import {handleRoleOwnedAutocomplete} from "./autocomplete/roleAutocomplete.js";
import {handleInvitationRoleRequestAutocomplete} from "./autocomplete/invitationRoleAutocomplete.js";

export async function interactionHandler(req, res) {
    const { type, data, member } = req.body;

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

    if (type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
        const focusedOption = data.options?.find(opt => opt.focused);

        if (!focusedOption) {
            console.error("❌ Aucune option focalisée détectée.");
            return res.status(400).json({ error: "No focused option" });
        }

        if (focusedOption.name === 'role_owned') {
            return handleRoleOwnedAutocomplete(req, res);
        }

        if(focusedOption.name === 'invitation_role_request'){
            return handleInvitationRoleRequestAutocomplete(req,res);
        }


    }

    console.error('unknown interaction type', type);
    return res.status(400).json({ error: 'unknown interaction type' });
}