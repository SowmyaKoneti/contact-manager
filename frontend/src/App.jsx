// App.js
import { useEffect, useState } from 'react';
import AddContactForm from './components/AddContactForm';
import ContactList from './components/ContactList';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/contacts');
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      if (query.trim() === '') {
        fetchContacts();
      } else {
        const res = await fetch(`http://localhost:5000/contacts/search?q=${query}`);
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
    }
  };

  const handleAdd = (contact) => {
    setContacts(prev => [...prev, contact]);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="app-root">
      <div className="app-container">
        <h1>Contact List Manager</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        <AddContactForm onAdd={handleAdd} />

        {contacts.length > 0 ? (
          <ContactList
            contacts={contacts}
            onDelete={id =>
              setContacts(prev => prev.filter(c => c.id !== id))
            }
          />
        ) : (
          <p style={{ textAlign: 'center', color: '#666' }}>
            {searchQuery ? 'No contacts found' : 'No contacts available'}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;