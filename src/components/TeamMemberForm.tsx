import React, { useState } from 'react';
import { TeamMember, Team, CreateTeamMemberRequest } from '../types';
import './common.css';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  teams: Team[];
  onSubmit: (memberData: CreateTeamMemberRequest) => Promise<void>;
  onCancel: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, teams, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateTeamMemberRequest>({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    jurisdiction: member?.jurisdiction || '',
    capacityPercentage: member?.capacityPercentage || 100,
    teamId: member?.teamId || (teams.length > 0 ? teams[0].id : 0),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamId' || name === 'capacityPercentage' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('First name, last name, and email are required');
      return;
    }

    if (formData.capacityPercentage < 0 || formData.capacityPercentage > 100) {
      setError('Capacity percentage must be between 0 and 100');
      return;
    }

    if (!formData.teamId) {
      setError('Please select a team');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save team member');
      console.error('Error saving team member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{member ? 'Edit Team Member' : 'Add Team Member'}</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jurisdiction">Jurisdiction</label>
            <input
              type="text"
              id="jurisdiction"
              name="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., US, UK, AU"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacityPercentage">Capacity Percentage *</label>
            <input
              type="number"
              id="capacityPercentage"
              name="capacityPercentage"
              value={formData.capacityPercentage}
              onChange={handleChange}
              className="form-control"
              min="0"
              max="100"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamId">Team *</label>
            <select
              id="teamId"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            >
              <option value="">Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
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
              {loading ? 'Saving...' : (member ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamMemberForm;