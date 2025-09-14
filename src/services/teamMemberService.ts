import { apiClient } from './api';
import { TeamMember, CreateTeamMemberRequest } from '../types';

export const teamMemberService = {
  async getAllMembers(): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>('/team-members');
  },

  async getMembersByTeam(teamId: number): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(`/team-members/team/${teamId}`);
  },

  async getMemberById(id: number): Promise<TeamMember> {
    return apiClient.get<TeamMember>(`/team-members/${id}`);
  },

  async createMember(member: CreateTeamMemberRequest): Promise<TeamMember> {
    return apiClient.post<TeamMember>('/team-members', member);
  },

  async updateMember(id: number, member: CreateTeamMemberRequest): Promise<TeamMember> {
    return apiClient.put<TeamMember>(`/team-members/${id}`, member);
  },

  async deleteMember(id: number): Promise<void> {
    return apiClient.delete(`/team-members/${id}`);
  },
};