import db from "../../../config/database.js";

export  async function getRoleInvitations() {
    try {
        return await db.query('SELECT * FROM role_invitations');
    } catch (error) {
        console.error('Error getting role invitations', error);
        throw error;
    }
}

export async function createInvitation(roleId, memberId) {
    try {
        const existingInvitations = await getRoleInvitations();
        const invitationExists = existingInvitations.some(invitation => invitation.role_id === roleId && invitation.member_id === memberId);

        if (invitationExists) {
            throw new Error('Invitation already exists for this role and member.');
        }

        const result = await db.query(
            'INSERT INTO role_invitations (role_id, member_id) VALUES ($1, $2) RETURNING *',
            [roleId, memberId]
        );
        return result[0];
    } catch (error) {
        console.error('Error creating invitation:', error);
        throw error;
    }
}