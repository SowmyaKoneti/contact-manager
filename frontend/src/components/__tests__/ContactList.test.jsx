import { render, screen } from '@testing-library/react';
import ContactList from '../ContactList';

test('renders contact names and emails', () => {
    const contacts = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    render(<ContactList contacts={contacts} onDelete={() => { }} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
});
