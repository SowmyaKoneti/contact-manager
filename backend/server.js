import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initDB, getDB } from './db.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Contact Manager API is running!')
})

await initDB()


app.post('/contacts', async (req, res) => {
    const db = getDB()
    await db.read()

    const { name, email } = req.body
    // name and email are required
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' })
    }
    // name must not be empty
    if (name.trim().length === 0) {
        return res.status(400).json({ error: 'Name cannot be empty' });
    }

    // name must not contain numbers
    if (/\d/.test(name)) {
        return res.status(400).json({ error: 'Name cannot contain numbers' });
    }

    // name must be between 2 and 50 characters
    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ error: 'Name must be between 2 and 50 characters.' });
    }
    // email must be less than 100 characters
    if (email.length > 100) {
        return res.status(400).json({ error: 'Email must be less than 100 characters.' });
    }

    //Email must end with "@gmail.com"
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'please provide valid email.' });
    }

    // duplicate check
    const duplicate = db.data.contacts.find(c => c.email === email)
    if (duplicate) {
        return res.status(409).json({ error: 'user already exists' })
    }
    //adds to db only if valid
    const newContact = { id: db.data.nextId++, name, email }
    db.data.contacts.push(newContact)
    await db.write()
    res.status(201).json(newContact)
})

app.get('/contacts', async (req, res) => {
    const db = getDB()
    await db.read()
    res.json(db.data.contacts)
})

app.get('/contacts/search', async (req, res) => {
    const db = getDB()
    await db.read()
    const query = req.query.q?.toLowerCase()

    if (!query) {
        return res.status(400).json({ error: 'Search query is required.' })
    }

    const results = db.data.contacts.filter(
        c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)
    )

    res.json(results)
})

app.delete('/contacts/:id', async (req, res) => {
    const db = getDB()
    await db.read()
    const id = parseInt(req.params.id)

    const index = db.data.contacts.findIndex(c => c.id === id)
    if (index === -1) {
        return res.status(404).json({ error: 'Contact not found.' })
    }

    const deleted = db.data.contacts.splice(index, 1)
    await db.write()

    res.json({ message: 'Contact deleted.', contact: deleted[0] })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
