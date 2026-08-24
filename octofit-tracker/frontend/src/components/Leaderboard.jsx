import { useEffect, useState } from 'react';

import { buildApiUrl, normalizeApiRecords } from '../api';

function getValue(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      try {
        const response = await fetch(buildApiUrl('leaderboard'));

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setLeaderboard(normalizeApiRecords(payload));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-secondary">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-3">Leaderboard</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Points</th>
                <th>Streak</th>
                <th>Recent Wins</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry._id ?? entry.id ?? `${entry.userId?.name ?? 'entry'}-${index}`}>
                  <td>#{getValue(entry.rank, index + 1)}</td>
                  <td>{entry.userId?.name ?? 'Unknown athlete'}</td>
                  <td>{getValue(entry.points, 0)}</td>
                  <td>{getValue(entry.streak, 0)}</td>
                  <td>{getValue(entry.recentWins, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
