import { useEffect, useState } from 'react';

import { normalizeApiRecords } from '../api';

function getValue(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const baseUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
          : 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/users/`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setUsers(normalizeApiRecords(payload));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load users.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-secondary">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-3">Users</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Fitness</th>
                <th>Goals</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id ?? user.id ?? `${user.email ?? 'user'}-${index}`}>
                  <td>{getValue(user.name)}</td>
                  <td>{getValue(user.email)}</td>
                  <td>
                    <span className="badge text-bg-primary">{getValue(user.role, 'member')}</span>
                  </td>
                  <td>{getValue(user.fitnessLevel, 'beginner')}</td>
                  <td>{Array.isArray(user.goals) && user.goals.length ? user.goals.join(', ') : 'General fitness'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
