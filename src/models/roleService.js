import db from "../config/database.js";

export async function getRoles() {
    try {
        return await db.query('SELECT name FROM roles');
    } catch (error) {
        console.error('Error getting roles', error);
        throw error;
    }
}

export async function createRole(id, name, ownerId) {
    try {
        const result = await db.query(
            'INSERT INTO roles (id, name, owner_id) VALUES ($1, $2, $3) RETURNING *',
            [id, name, ownerId]
        );
        return result[0];
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
}

export async function getMemberCountByRoleId(roleId) {
    try {
        const result = await db.query(
            'SELECT cardinality(member_ids) AS member_count FROM roles WHERE id = $1',
            [roleId]
        );
        return result[0].member_count;
    } catch (error) {
        console.error('Error getting member count by role ID:', error);
        throw error;
    }
}

export async function getRoleById(roleId) {
    try {
        const result = await db.query(
            'SELECT * FROM roles WHERE id = $1',
            [roleId]
        );
        return result[0];
    } catch (error) {
        console.error('Error getting role by ID:', error);
        throw error;
    }
}

export async function getRoleOwnerByOwnerId(ownerId) {
    try {
        return await db.query('SELECT id, name FROM roles WHERE owner_id = $1', [ownerId]);
    } catch (error) {
        console.error('Error getting role by owner ID:', error);
        throw error;
    }
}

export async function getRoleOwnerByOwnerIdAndRoleId(ownerId, roleId) {
    try {
        return await db.query('SELECT owner_id FROM roles WHERE owner_id = $1 AND id = $2', [ownerId, roleId]);
    } catch (error) {
        console.error('Error getting role by owner ID and role ID:', error);
        throw error;
    }
}

export async function putMemberToRole(roleId, memberName) {
    try {
        return await db.query(
            'UPDATE roles SET member_ids = array_append(member_ids, $1) WHERE id = $2',
            [memberName, roleId]
        );
    } catch (error) {
        console.error('Error adding member to role:', error);
        throw error;
    }
}