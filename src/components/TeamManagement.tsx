import React, { useState, useEffect } from 'react';
import { Team, CreateTeamRequest } from '../types';
import { teamService } from '../services/teamService';
import TeamForm from './TeamForm';
import './common.css';

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Error loading teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (teamData: CreateTeamRequest) => {
    try {
      await teamService.createTeam(teamData);
      setShowForm(false);
      loadTeams();
    } catch (err) {
      console.error('Error creating team:', err);
      throw err;
    }
  };

  const handleUpdateTeam = async (teamData: CreateTeamRequest) => {
    if (!editingTeam) return;

    try {
      await teamService.updateTeam(editingTeam.id, teamData);
      setEditingTeam(null);
      setShowForm(false);
      loadTeams();
    } catch (err) {
      console.error('Error updating team:', err);
      throw err;
    }
  };

  const handleDeleteTeam = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamService.deleteTeam(id);
        loadTeams();
      } catch (err) {
        setError('Failed to delete team');
        console.error('Error deleting team:', err);
      }
    }
  };

  const openCreateForm = () => {
    setEditingTeam(null);
    setShowForm(true);
  };

  const openEditForm = (team: Team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  if (loading) return <div className="loading">Loading teams...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>Team Management</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>
          Create Team
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        {teams.length === 0 ? (
          <p>No teams found. Create your first team to get started.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.description}</td>
                  <td>
                    {team.members && team.members.length > 0 ? (
                      team.members.map((member) => (
                        <span key={member.id} className="team-member-badge">
                          {member.firstName} {member.lastName}
                        </span>
                      ))
                    ) : (
                      <span>No members</span>
                    )}
                  </td>
                  <td>{new Date(team.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      onClick={() => openEditForm(team)}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteTeam(team.id)}
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
        <TeamForm
          team={editingTeam}
          onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default TeamManagement;