const ContactList = ({ contacts, onDelete }) => {
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this contact?');
        if (!confirmed) return;

        try {
            const res = await fetch(`http://localhost:5000/contacts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                onDelete(id);
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    return (
        <ul className="contact-list">
            {contacts.map(contact => (
                <li key={contact.id}>
                    <div>
                        <strong>{contact.name}</strong>
                        <small>{contact.email}</small>
                    </div>
                    <button
                        onClick={() => handleDelete(contact.id)}
                        className="delete-btn"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ContactList;