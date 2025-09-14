import React, { useState, useEffect } from 'react';
import { Leave, Team, TeamMember, CreateLeaveRequest, LeaveType } from '../types';
import { leaveService } from '../services/leaveService';
import { teamService } from '../services/teamService';
import { teamMemberService } from '../services/teamMemberService';
import LeaveForm from './LeaveForm';
import './common.css';

const LeaveManagement: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);

  useEffect(() => {
    loadTeams();
    loadMembers();
    loadLeaves();
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [selectedTeamId]);

  const loadTeams = async () => {
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err) {
      console.error('Error loading teams:', err);
    }
  };

  const loadMembers = async () => {
    try {
      const data = await teamMemberService.getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const loadLeaves = async () => {
    try {
      setLoading(true);
      setError(null);
      let data: Leave[];

      if (selectedTeamId === 'all') {
        data = await leaveService.getAllLeaves();
      } else {
        data = await leaveService.getLeavesByTeam(selectedTeamId as number);
      }

      setLeaves(data);
    } catch (err) {
      setError('Failed to load leaves');
      console.error('Error loading leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeave = async (leaveData: CreateLeaveRequest) => {
    try {
      await leaveService.createLeave(leaveData);
      setShowForm(false);
      loadLeaves();
    } catch (err) {
      console.error('Error creating leave:', err);
      throw err;
    }
  };

  const handleUpdateLeave = async (leaveData: CreateLeaveRequest) => {
    if (!editingLeave) return;

    try {
      await leaveService.updateLeave(editingLeave.id, leaveData);
      setEditingLeave(null);
      setShowForm(false);
      loadLeaves();
    } catch (err) {
      console.error('Error updating leave:', err);
      throw err;
    }
  };

  const handleDeleteLeave = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this leave?')) {
      try {
        await leaveService.deleteLeave(id);
        loadLeaves();
      } catch (err) {
        setError('Failed to delete leave');
        console.error('Error deleting leave:', err);
      }
    }
  };

  const openCreateForm = () => {
    setEditingLeave(null);
    setShowForm(true);
  };

  const openEditForm = (leave: Leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLeave(null);
  };

  const getLeaveTypeClass = (leaveType: LeaveType): string => {
    switch (leaveType) {
      case LeaveType.ANNUAL_LEAVE:
        return 'annual';
      case LeaveType.SICK_LEAVE:
        return 'sick';
      case LeaveType.PERSONAL_LEAVE:
        return 'personal';
      case LeaveType.PUBLIC_HOLIDAY:
        return 'holiday';
      case LeaveType.CONFERENCE:
        return 'conference';
      default:
        return 'other';
    }
  };

  const formatLeaveType = (leaveType: LeaveType): string => {
    return leaveType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) return <div className="loading">Loading leaves...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Leave Management</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>
          Add Leave
        </button>
      </div>

      <div className="card">
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="teamFilter">Filter by Team:</label>
          <select
            id="teamFilter"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="form-control"
            style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        {leaves.length === 0 ? (
          <p>No leaves found. Add the first leave entry to get started.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.teamMemberName}</td>
                  <td>
                    <span className={`leave-type ${getLeaveTypeClass(leave.leaveType)}`}>
                      {formatLeaveType(leave.leaveType)}
                    </span>
                  </td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.description}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => openEditForm(leave)}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteLeave(leave.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <LeaveForm
          leave={editingLeave}
          members={members}
          onSubmit={editingLeave ? handleUpdateLeave : handleCreateLeave}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default LeaveManagement;