import React, { useState, useEffect } from 'react';
import { TeamMember, Team, CreateTeamMemberRequest } from '../types';
import { teamMemberService } from '../services/teamMemberService';
import { teamService } from '../services/teamService';
import TeamMemberForm from './TeamMemberForm';
import './common.css';

const TeamMemberManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    loadTeams();
    loadMembers();
  }, []);

  useEffect(() => {
    loadMembers();
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
      setLoading(true);
      setError(null);
      let data: TeamMember[];

      if (selectedTeamId === 'all') {
        data = await teamMemberService.getAllMembers();
      } else {
        data = await teamMemberService.getMembersByTeam(selectedTeamId as number);
      }

      setMembers(data);
    } catch (err) {
      setError('Failed to load team members');
      console.error('Error loading team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (memberData: CreateTeamMemberRequest) => {
    try {
      await teamMemberService.createMember(memberData);
      setShowForm(false);
      loadMembers();
    } catch (err) {
      console.error('Error creating member:', err);
      throw err;
    }
  };

  const handleUpdateMember = async (memberData: CreateTeamMemberRequest) => {
    if (!editingMember) return;

    try {
      await teamMemberService.updateMember(editingMember.id, memberData);
      setEditingMember(null);
      setShowForm(false);
      loadMembers();
    } catch (err) {
      console.error('Error updating member:', err);
      throw err;
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await teamMemberService.deleteMember(id);
        loadMembers();
      } catch (err) {
        setError('Failed to delete team member');
        console.error('Error deleting team member:', err);
      }
    }
  };

  const openCreateForm = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (loading) return <div className="loading">Loading team members...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Team Member Management</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>
          Add Team Member
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

        {members.length === 0 ? (
          <p>No team members found. Add your first team member to get started.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Jurisdiction</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.teamName}</td>
                  <td>{member.jurisdiction || 'Not set'}</td>
                  <td>{member.capacityPercentage}%</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => openEditForm(member)}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteMember(member.id)}
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
        <TeamMemberForm
          member={editingMember}
          teams={teams}
          onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default TeamMemberManagement;