import { InteractionResponseType } from 'discord-interactions';
import {getRoleInvitationByMemberId} from "../../models/roleInvitationService.js";

export async function handleInvitationRoleRequestAutocomplete(req, res) {
    const { member } = req.body;

    try {
        const roles = await getRoleInvitationByMemberId(member.user.id);

        return res.json({
            type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
            data: {
                choices: roles.map(role => ({ name: role.role_name, value: role.role_id }))
            }
        });
    } catch (error) {
        console.error("❌ Erreur PostgreSQL :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}