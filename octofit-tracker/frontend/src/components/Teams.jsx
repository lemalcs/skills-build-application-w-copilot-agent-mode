import { useEffect, useState } from 'react';

import { buildApiUrl, normalizeApiRecords } from '../api';

function getValue(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        const response = await fetch(buildApiUrl('teams'));

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setTeams(normalizeApiRecords(payload));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load teams.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-secondary">Loading teams...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-3">Teams</h2>
        <div className="row g-3">
          {teams.map((team, index) => (
            <div key={team._id ?? team.id ?? `${team.name ?? 'team'}-${index}`} className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">{getValue(team.name)}</h3>
                  <span className="badge text-bg-success">{getValue(team.sport)}</span>
                </div>
                <p className="mb-2"><strong>Focus:</strong> {getValue(team.focus)}</p>
                <p className="mb-2"><strong>Location:</strong> {getValue(team.location)}</p>
                <p className="mb-2"><strong>Captain:</strong> {team.captain?.name ?? 'Unassigned'}</p>
                <p className="mb-0"><strong>Members:</strong> {Array.isArray(team.members) ? team.members.length : 0}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
