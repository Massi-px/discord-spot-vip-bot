import { InteractionResponseType } from 'discord-interactions';
import {createRole, getRoles} from '../models/roleService.js';

export async function handleCreateRoleCommand(req, res) {
    const { guild_id, data } = req.body;
    const roleName = data.options.find(option => option.name === 'rolename').value;
    const ownerId = data.options.find(option => option.name === 'owner').value;

    try {
        const roles = await getRoles();
        if (roles.some(role => role.name === roleName)) {
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Role ${roleName} already exists!`,
                },
            });
        }

        const response = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/roles`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: roleName,
                permissions: 0,
            }),
        });

        const role = await response.json();

        const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guild_id}/members/${ownerId}/roles/${role.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!memberResponse.ok) {
            throw new Error(`Error adding role to owner: ${memberResponse.statusText}`);
        }

        await createRole(role.id, role.name, ownerId);

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Role ${role.name} created successfully and assigned to the owner!`,
            },
        });
    } catch (error) {
        console.error(error);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `Failed to create role: ${error.message}`,
            },
        });
    }
}