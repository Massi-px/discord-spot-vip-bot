import { InteractionResponseType } from 'discord-interactions';
import { updateInvitationStatus } from '../models/roleInvitationService.js';
import {putMemberToRole} from "../models/roleService.js";

export async function handleAcceptRoleVipCommand(req, res) {
    const { data, member, guild_id } = req.body;

    if (!data || !data.options) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Invalid command data.`,
            },
        });
    }

    const roleId = data.options.find(option => option.name === 'invitation_role_request')?.value;
    const memberId = member.user.id;

    try {
        const result = await updateInvitationStatus(roleId, memberId, 'accepted');

        if (result.rowCount === 0) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `No pending invitation found for this role.`,
                },
            });
        }

        const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/members/${memberId}/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error adding role to member: ${response.statusText}`);
        }

        await putMemberToRole(roleId, member.user.global_name);

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Invitation accepted successfully!`,
            },
        });
    } catch (error) {
        console.error(error);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Failed to accept invitation: ${error.message}`,
            },
        });
    }
}