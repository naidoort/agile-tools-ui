export interface Team {
  id: number;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jurisdiction: string;
  capacityPercentage: number;
  teamId: number;
  teamName: string;
  leaves: Leave[];
  createdAt: string;
  updatedAt: string;
}

export interface Leave {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  description: string;
  teamMemberId: number;
  teamMemberName: string;
  createdAt: string;
  updatedAt: string;
}

export enum LeaveType {
  ANNUAL_LEAVE = 'ANNUAL_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  PERSONAL_LEAVE = 'PERSONAL_LEAVE',
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY',
  CONFERENCE = 'CONFERENCE',
  OTHER = 'OTHER'
}

export interface CreateTeamRequest {
  name: string;
  description: string;
}

export interface CreateTeamMemberRequest {
  firstName: string;
  lastName: string;
  email: string;
  jurisdiction: string;
  capacityPercentage: number;
  teamId: number;
}

export interface CreateLeaveRequest {
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  description: string;
  teamMemberId: number;
}