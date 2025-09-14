import React, { useState } from 'react';
import { Leave, TeamMember, CreateLeaveRequest, LeaveType } from '../types';
import './common.css';

interface LeaveFormProps {
  leave?: Leave | null;
  members: TeamMember[];
  onSubmit: (leaveData: CreateLeaveRequest) => Promise<void>;
  onCancel: () => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ leave, members, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateLeaveRequest>({
    startDate: leave?.startDate || '',
    endDate: leave?.endDate || '',
    leaveType: leave?.leaveType || LeaveType.ANNUAL_LEAVE,
    description: leave?.description || '',
    teamMemberId: leave?.teamMemberId || (members.length > 0 ? members[0].id : 0),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'teamMemberId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      setError('Start date and end date are required');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    if (!formData.teamMemberId) {
      setError('Please select a team member');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to save leave');
      console.error('Error saving leave:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLeaveType = (leaveType: LeaveType): string => {
    return leaveType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{leave ? 'Edit Leave' : 'Add Leave'}</h2>
          <button className="close-btn" onClick={onCancel} disabled={loading}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teamMemberId">Team Member *</label>
            <select
              id="teamMemberId"
              name="teamMemberId"
              value={formData.teamMemberId}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            >
              <option value="">Select a team member</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.teamName})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="leaveType">Leave Type *</label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            >
              {Object.values(LeaveType).map((type) => (
                <option key={type} value={type}>
                  {formatLeaveType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
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
              placeholder="Optional description or reason for leave"
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
              {loading ? 'Saving...' : (leave ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;