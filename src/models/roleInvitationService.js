import db from "../config/database.js";

export  async function getRoleInvitations() {
    try {
        return await db.query('SELECT * FROM role_invitations');
    } catch (error) {
        console.error('Error getting role invitations', error);
        throw error;
    }
}

export async function createInvitation(roleId, ownerId, memberId) {
    try {
        const existingInvitations = await getRoleInvitations();
        const invitationExists = existingInvitations.some(invitation => invitation.role_id === roleId && invitation.member_id === memberId && invitation.status === 'pending');

        if (invitationExists) {
            throw new Error('Invitation already exists for this role and member.');
        }

        const invitationsAccepted = existingInvitations.some(invitation => invitation.role_id === roleId && invitation.member_id === memberId && invitation.status === 'accepted');
        if(invitationsAccepted) {
            throw new Error('Invitation already accepted for this role and member.');
        }

        const result = await db.query(
            'INSERT INTO role_invitations (role_id, owner_id, member_id) VALUES ($1, $2, $3) RETURNING *',
            [roleId, ownerId, memberId]
        );
        return result[0];
    } catch (error) {
        console.error('Error creating invitation:', error);
        throw error;
    }
}

export async function updateInvitationStatus(roleId, memberId, status) {
    try {
        return await db.query(
            'UPDATE role_invitations SET status = $1 WHERE role_id = $2 AND member_id = $3 AND status = \'pending\'',
            [status, roleId, memberId]
        );
    } catch (error) {
        console.error('Error updating invitation status:', error);
        throw error;
    }
}

export async function getRoleInvitationByMemberId(memberId) {
    try {
        return await db.query(
            `SELECT role_invitations.role_id, roles.name AS role_name
             FROM role_invitations
                      JOIN roles ON role_invitations.role_id = roles.id
             WHERE role_invitations.member_id = $1 AND role_invitations.status = 'pending'`,
            [memberId]
        );
    } catch (error) {
        console.error('Error getting role invitation by member ID:', error);
        throw error;
    }
}