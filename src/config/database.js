import pkg from 'pg';
const { Client } = pkg;

class DbSingleton {
    constructor() {
        if (DbSingleton.instance) {
            return DbSingleton.instance;
        }

        this.client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'admin',
            password: 'secret',
            database: 'spot',
        });

        this.client.connect()
            .then(() => {
                console.log('Successfully connected to the database');
                return this.client.query('SET search_path TO spot_bot_vip');
            })
            .catch((err) => {
                console.error('Database connection error:', err);
            });

        DbSingleton.instance = this;
    }

    async query(text, params) {
        try {
            const res = await this.client.query(text, params);
            return res.rows;
        } catch (err) {
            console.error('Error executing query', err);
            throw err;
        }
    }

    async close() {
        await this.client.end();
        console.log('Connection closed');
    }
}

export default new DbSingleton();
