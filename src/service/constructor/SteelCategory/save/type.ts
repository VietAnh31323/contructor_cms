export type SteelCategorySave = {
  id: number;
  code: string;
  name: string;
  images: Image[];
  description: string;
  isActive: boolean;
  steelCategoryLines: SteelCategoryLine[];
};
export interface Image {
  name: string;
  url: string;
  type: string;
}

export interface SteelCategoryLine {
  id: number;
  paramName: string;
}
export type RequestBody = {
  SAVE: SteelCategorySave;
};
