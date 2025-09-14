import { apiClient } from './api';
import { Leave, CreateLeaveRequest } from '../types';

export const leaveService = {
  async getAllLeaves(): Promise<Leave[]> {
    return apiClient.get<Leave[]>('/leaves');
  },

  async getLeavesByMember(teamMemberId: number): Promise<Leave[]> {
    return apiClient.get<Leave[]>(`/leaves/member/${teamMemberId}`);
  },

  async getLeavesByTeam(teamId: number): Promise<Leave[]> {
    return apiClient.get<Leave[]>(`/leaves/team/${teamId}`);
  },

  async getTeamLeavesInPeriod(teamId: number, startDate: string, endDate: string): Promise<Leave[]> {
    return apiClient.get<Leave[]>(`/leaves/team/${teamId}/period?startDate=${startDate}&endDate=${endDate}`);
  },

  async getLeaveById(id: number): Promise<Leave> {
    return apiClient.get<Leave>(`/leaves/${id}`);
  },

  async createLeave(leave: CreateLeaveRequest): Promise<Leave> {
    return apiClient.post<Leave>('/leaves', leave);
  },

  async updateLeave(id: number, leave: CreateLeaveRequest): Promise<Leave> {
    return apiClient.put<Leave>(`/leaves/${id}`, leave);
  },

  async deleteLeave(id: number): Promise<void> {
    return apiClient.delete(`/leaves/${id}`);
  },
};