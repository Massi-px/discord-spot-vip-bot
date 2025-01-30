import db from "../../../config/database.js";

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

export async function getRoleById(roleId) {
    try {
        const result = await db.query('SELECT * FROM roles WHERE id = $1', [roleId]);
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