export type SteelSave = {
  id: number;
  images: Image[];
  barCode: number;
  barQuantity: number;
  spliceLength: number;
  barDiameter: number;
  steelLines: SteelLine[];
};
export interface Image {
  name: string;
  url: string;
  type: string;
}

export interface SteelLine {
  id: number;
  paramName: string;
  value: number;
}
export type RequestBody = {
  SAVE: SteelSave;
};
