import { BaseResponse } from "@/service/type";
import { AssemblyList } from "../getList/type";

export type AssemblyDetail = {
  id: number;
  code: string;
  name: string;
  owner: string;
  address: string;
  signDate: string;
  deliveryDate: string;
  description: string;
  steelProjectAssemblyMaps: SteelProjectAssemblyMap[];
};
export interface SteelProjectAssemblyMap {
  id: number;
  assemblyName: string;
  sameQuantity: number;
  steels: Steel[];
}

export interface Steel {
  id: number;
  barCode: number;
  assemblyName: string;
  images: Image[];
  barDiameter: number;
  barQuantity: number;
  sliceLength: number;
  length: number;
}

export interface Image {
  name: string;
  url: string;
  type: string;
}
export type Response = {
  GET: BaseResponse<AssemblyDetail>;
};

export type RequestParams = {
  GET: {
    id: number;
  };
};
