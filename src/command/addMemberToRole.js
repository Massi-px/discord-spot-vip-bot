import { InteractionResponseType } from 'discord-interactions';
import { roleOwners } from './createVipRole.js';

export async function handleAddMemberToRoleCommand(req, res) {
    const { guild_id, data, member } = req.body;

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

    const ownerId = roleOwners.get(roleId);
    if (ownerId !== member.user.id) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `You are not the owner of this role.`,
            },
        });
    }

    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/members/${memberId}/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error adding member to role: ${response.statusText}`);
        }

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Member added to role successfully!`,
            },
        });
    } catch (error) {
        console.error(error);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Failed to add member to role: ${error.message}`,
            },
        });
    }
}