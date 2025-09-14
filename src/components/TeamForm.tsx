import React, { useState } from 'react';
import { Team, CreateTeamRequest } from '../types';
import './common.css';

interface TeamFormProps {
  team?: Team | null;
  onSubmit: (teamData: CreateTeamRequest) => Promise<void>;
  onCancel: () => void;
}

const TeamForm: React.FC<TeamFormProps> = ({ team, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateTeamRequest>({
    name: team?.name || '',
    description: team?.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save team');
      console.error('Error saving team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{team ? 'Edit Team' : 'Create Team'}</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Team Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows={3}
              disabled={loading}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (team ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;