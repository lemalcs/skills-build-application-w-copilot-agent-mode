import { useEffect, useState } from 'react';

import { buildApiUrl, normalizeApiRecords } from '../api';

function getValue(value, fallback = 'N/A') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  return value;
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadWorkouts() {
      try {
        const response = await fetch(buildApiUrl('workouts'));

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();

        if (isMounted) {
          setWorkouts(normalizeApiRecords(payload));
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load workouts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="alert alert-secondary">Loading workouts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="mb-3">Workouts</h2>
        <div className="row g-3">
          {workouts.map((workout, index) => (
            <div key={workout._id ?? workout.id ?? `${workout.title ?? 'workout'}-${index}`} className="col-md-6">
              <div className="border rounded p-3 h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="h5 mb-0">{getValue(workout.title)}</h3>
                  <span className="badge text-bg-warning">{getValue(workout.difficulty)}</span>
                </div>
                <p className="mb-2"><strong>Duration:</strong> {getValue(workout.durationMinutes)} min</p>
                <p className="mb-2"><strong>Focus:</strong> {getValue(workout.focus)}</p>
                <p className="mb-2"><strong>Target areas:</strong> {Array.isArray(workout.targetAreas) && workout.targetAreas.length ? workout.targetAreas.join(', ') : 'General body'}</p>
                <p className="mb-0"><strong>Equipment:</strong> {Array.isArray(workout.equipment) && workout.equipment.length ? workout.equipment.join(', ') : 'Bodyweight'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
