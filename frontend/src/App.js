import { useState, useEffect } from 'react';  // import useEffect
import ContactList from './components/ContactList';
import Stats from './components/Stats';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        fetch('http://localhost/api/contacts')
            .then(response => response.json())
            .then(data => setContacts(data))
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className='page'>
            <h1>Jefri Dashboard</h1>
            <Dashboard />
            <ContactList contacts={contacts} setContacts={setContacts} />
            <p>Click a contact to view associated phone numbers</p>
            <Stats />
        </div>
    );
}

export default App;