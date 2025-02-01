import { InteractionResponseType } from 'discord-interactions';
import { createInvitation } from '../models/roleInvitationService.js';
import {getRoleOwnerByOwnerIdAndRoleId, getRoleById, getMemberCountByRoleId} from "../models/roleService.js";

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

    const roleId = data.options.find(option => option.name === 'role_owned')?.value;
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

    const role = await getRoleById(roleId);
    const memberCount = await getMemberCountByRoleId(roleId);
    console.log(memberCount);
    if (memberCount >= role.members_max_count) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `The role is full.`,
            },
        });
    }

    try {
        await createInvitation(roleId, member.user.id, memberId);

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