import { useEffect, useState } from 'react';

import { normalizeApiRecords } from '../api';

function getValue(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        const baseUrl = import.meta.env.VITE_CODESPACE_NAME
          ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev`
          : 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/activities/`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setActivities(normalizeApiRecords(payload));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load activities.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-secondary">Loading activities...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-3">Activities</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Intensity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={activity._id ?? activity.id ?? `${activity.type ?? 'activity'}-${index}`}>
                  <td>{getValue(activity.type)}</td>
                  <td>{activity.userId?.name ?? 'Unknown user'}</td>
                  <td>{getValue(activity.durationMinutes)} min</td>
                  <td>{getValue(activity.caloriesBurned)} kcal</td>
                  <td>
                    <span className="badge text-bg-info">{getValue(activity.intensity)}</span>
                  </td>
                  <td>{activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
