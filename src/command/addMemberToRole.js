import { InteractionResponseType } from 'discord-interactions';
import { createInvitation } from '../services/bff/role/roleInvitationService.js';
import {getRoleById, getRoleOwnerByOwnerIdAndRoleId} from "../services/bff/role/roleService.js";

export async function handleAddMemberToRoleCommand(req, res) {
    const { data, member } = req.body;

    if (!data || !data.options) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Invalid command data.`,
            },
        });
    }

    const roleId = data.options.find(option => option.name === 'roleid')?.value;
    const memberId = data.options.find(option => option.name === 'member')?.value;

    if (!roleId || !memberId) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Role ID or Member ID is missing.`,
            },
        });
    }

    const owner = await getRoleOwnerByOwnerIdAndRoleId(memberId, roleId);
    if (!owner) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `You are not the owner of this role.`,
            },
        });
    }

    try {
        await createInvitation(roleId, memberId);

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Invitation created successfully!`,
            },
        });
    } catch (error) {
        console.error(error);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Failed to create invitation: ${error.message}`,
            },
        });
    }
}