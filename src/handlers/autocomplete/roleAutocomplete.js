import { InteractionResponseType } from 'discord-interactions';
import { getRoleOwnerByOwnerId } from '../../models/roleService.js';

export async function handleRoleOwnedAutocomplete(req, res) {
    const { member } = req.body;

    try {
        const roles = await getRoleOwnerByOwnerId(member.user.id);

        return res.json({
            type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
            data: {
                choices: roles.map(role => ({ name: role.name, value: role.id }))
            }
        });
    } catch (error) {
        console.error("❌ Erreur PostgreSQL :", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}