import { apiClient } from './api';
import { Team, CreateTeamRequest } from '../types';

export const teamService = {
  async getAllTeams(): Promise<Team[]> {
    return apiClient.get<Team[]>('/teams');
  },

  async getTeamById(id: number): Promise<Team> {
    return apiClient.get<Team>(`/teams/${id}`);
  },

  async createTeam(team: CreateTeamRequest): Promise<Team> {
    return apiClient.post<Team>('/teams', team);
  },

  async updateTeam(id: number, team: CreateTeamRequest): Promise<Team> {
    return apiClient.put<Team>(`/teams/${id}`, team);
  },

  async deleteTeam(id: number): Promise<void> {
    return apiClient.delete(`/teams/${id}`);
  },
};