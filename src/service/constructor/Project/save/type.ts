export type ProjectSave = {
  id: number;
  code: string;
  name: string;
  owner: string;
  address: string;
  contractValue: number;
  contractAdvance: number;
  remainingAmount: number;
  signDate: string;
  deliveryDate: string;
  creator: Creator;
  manager: Manager;
  supporter: Supporter;
  description: string;
  note: string;
  state: string;
  contractFiles: ContractFile[];
  sampleImages: SampleImage[];
  projectImages: ProjectImage[];
  projectCategoryMaps: ProjectCategoryMap[];
  projectLines: ProjectLine[];
};
export interface Creator {
  id: number;
  code: string;
  name: string;
}

export interface Manager {
  id: number;
  code: string;
  name: string;
}

export interface Supporter {
  id: number;
  code: string;
  name: string;
}

export interface ContractFile {
  name: string;
  url: string;
  type: string;
}

export interface SampleImage {
  name: string;
  url: string;
  type: string;
}

export interface ProjectImage {
  name: string;
  url: string;
  type: string;
}

export interface ProjectCategoryMap {
  id: number;
  category: Category;
}

export interface Category {
  id: number;
  code: string;
  name: string;
}

export interface ProjectLine {
  id: number;
  paymentDate: string;
  paymentNo: number;
  paymentAmount: number;
}
export type RequestBody = {
  SAVE: ProjectSave;
};
