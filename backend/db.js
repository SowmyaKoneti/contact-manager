import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

let db;

async function initDB() {
    const adapter = new JSONFile('contacts.json');
    db = new Low(adapter, { contacts: [], nextId: 1 }); // Initializes with default data

    await db.read();

    db.data ||= { contacts: [], nextId: 1 };

    await db.write();
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return db;
}

export { getDB, initDB };