import db from "../../../config/database.js";

export async function getOwnerByOwnerId(ownerId, roleId) {
    try {
        const result = await db.query('SELECT owner_id FROM roles WHERE owner_id = $1', [ownerId]);
        return result[0];
    } catch (error) {
        console.error('Error getting role by owner ID:', error);
        throw error;
    }
}