import { useState } from 'react';

const AddContactForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            setError('Both name and email are required.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Error adding contact.');
            } else {
                const contact = await res.json();
                onAdd(contact);
                setName('');
                setEmail('');
                setError('');
            }
        } catch (err) {
            setError('Server error. Try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-form">
            <h3>Add New Contact</h3>
            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">Add Contact</button>
            {error && <p className="error">{error}</p>}
        </form>
    );
};

export default AddContactForm;