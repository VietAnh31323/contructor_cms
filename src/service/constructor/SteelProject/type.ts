export interface UploadDto {
  id?: number;
  name?: string;
  url?: string;
  [key: string]: any;
}

export interface SteelLineDto {
  id?: number;
  paramName: string;
  value: number;
}

export interface SteelBarDto {
  id?: number;
  assemblyMapId?: number;
  steelCategoryId?: number | null;
  steelCategoryCode?: string;
  steelCategoryName?: string;
  barCode?: number;
  barLabel?: string;
  assemblyName?: string;
  images?: UploadDto[];
  barDiameter: number;
  barQuantity: number;
  spliceLength?: number;
  sliceLength?: number;
  bendDeduction?: number;
  segmentLength?: number;
  cutLength?: number;
  cutLengthMeter?: number;
  length?: number;
  unitWeight?: number;
  totalBars?: number;
  totalLength?: number;
  totalWeight?: number;
  sortOrder?: number;
  note?: string;
  steelLines?: SteelLineDto[];
}

export interface SteelProjectAssemblyMapDto {
  id?: number;
  assemblyName: string;
  sameQuantity: number;
  sortOrder?: number;
  note?: string;
  totalLength?: number;
  totalWeight?: number;
  steels?: SteelBarDto[];
}

export interface DiameterSummaryDto {
  barDiameter: number;
  totalBars: number;
  totalLengthMeter: number;
  totalWeightKg: number;
}

export interface SteelProjectDto {
  id?: number;
  code?: string;
  name: string;
  projectId?: number | null;
  projectCode?: string;
  projectName?: string;
  owner?: string;
  address?: string;
  signDate?: string;
  deliveryDate?: string;
  description?: string;
  totalLength?: number;
  totalWeight?: number;
  diameterSummaries?: DiameterSummaryDto[];
  steelProjectAssemblyMaps?: SteelProjectAssemblyMapDto[];
}

export interface SteelProjectOutput {
  id: number;
  code: string;
  name: string;
  projectId?: number | null;
  projectCode?: string;
  projectName?: string;
  owner?: string;
  address?: string;
  signDate?: string;
  deliveryDate?: string;
  description?: string;
  assemblyCount?: number;
  barCount?: number;
  totalLength?: number;
  totalWeight?: number;
}

export interface SteelProjectListParams {
  search?: string;
  projectId?: number | null;
  page?: number;
  size?: number;
}

export interface SteelCategoryOutput {
  id: number;
  code: string;
  name: string;
  images?: UploadDto[];
  description?: string;
  isActive?: boolean;
}

export interface SteelCategoryLineDto {
  id: number;
  paramName: string;
}

export interface SteelImportErrorDto {
  rowNumber: number;
  column: string;
  rawValue?: string;
  message: string;
}

export interface SteelImportResultDto {
  success: boolean;
  totalRows: number;
  validRows: number;
  errorCount: number;
  importedAssemblyCount: number;
  importedBarCount: number;
  errors: SteelImportErrorDto[];
  steelProject?: SteelProjectDto;
}
