import { ConsApi } from "@/config/axios";
import {
  ContractAddendumItem,
  ContractItem,
  ProjectMemberItem,
} from "./type";

// ==================== 2.10: THÀNH VIÊN DỰ ÁN ====================

export const getProjectMembers = async (
  projectId: number
): Promise<ProjectMemberItem[]> => {
  const res = await ConsApi.get<ProjectMemberItem[]>(
    `/api/v1/project/${projectId}/members`
  );
  return res.data;
};

export const addProjectMember = async (
  projectId: number,
  data: ProjectMemberItem
): Promise<{ id: number }> => {
  const res = await ConsApi.post<{ id: number }>(
    `/api/v1/project/${projectId}/members`,
    data
  );
  return res.data;
};

export const updateProjectMember = async (
  projectId: number,
  memberId: number,
  data: ProjectMemberItem
): Promise<{ id: number }> => {
  const res = await ConsApi.put<{ id: number }>(
    `/api/v1/project/${projectId}/members/${memberId}`,
    data
  );
  return res.data;
};

export const deleteProjectMember = async (
  projectId: number,
  memberId: number
): Promise<void> => {
  await ConsApi.delete(`/api/v1/project/${projectId}/members/${memberId}`);
};

// ==================== 2.11: HỢP ĐỒNG & PHỤ LỤC ====================

export const getProjectContracts = async (
  projectId: number
): Promise<ContractItem[]> => {
  const res = await ConsApi.get<ContractItem[]>(
    `/api/v1/project/${projectId}/contracts`
  );
  return res.data;
};

export const getContractDetail = async (
  projectId: number,
  contractId: number
): Promise<ContractItem> => {
  const res = await ConsApi.get<ContractItem>(
    `/api/v1/project/${projectId}/contracts/${contractId}`
  );
  return res.data;
};

export const createContract = async (
  projectId: number,
  data: ContractItem
): Promise<{ id: number }> => {
  const res = await ConsApi.post<{ id: number }>(
    `/api/v1/project/${projectId}/contracts`,
    data
  );
  return res.data;
};

export const updateContract = async (
  projectId: number,
  contractId: number,
  data: ContractItem
): Promise<{ id: number }> => {
  const res = await ConsApi.put<{ id: number }>(
    `/api/v1/project/${projectId}/contracts/${contractId}`,
    data
  );
  return res.data;
};

export const deleteContract = async (
  projectId: number,
  contractId: number
): Promise<void> => {
  await ConsApi.delete(
    `/api/v1/project/${projectId}/contracts/${contractId}`
  );
};

export const addContractAddendum = async (
  projectId: number,
  contractId: number,
  data: ContractAddendumItem
): Promise<{ id: number }> => {
  const res = await ConsApi.post<{ id: number }>(
    `/api/v1/project/${projectId}/contracts/${contractId}/addendums`,
    data
  );
  return res.data;
};

export const updateContractAddendum = async (
  projectId: number,
  contractId: number,
  addendumId: number,
  data: ContractAddendumItem
): Promise<{ id: number }> => {
  const res = await ConsApi.put<{ id: number }>(
    `/api/v1/project/${projectId}/contracts/${contractId}/addendums/${addendumId}`,
    data
  );
  return res.data;
};

export const deleteContractAddendum = async (
  projectId: number,
  contractId: number,
  addendumId: number
): Promise<void> => {
  await ConsApi.delete(
    `/api/v1/project/${projectId}/contracts/${contractId}/addendums/${addendumId}`
  );
};
