import { BaseResponse } from "@/service/type";
import { AssemblyList } from "../getList/type";

export type ByAssemblyDetail = [
  {
    id: number;
    barCode: number;
    assemblyName: string;
    images: [
      {
        name: string;
        url: string;
        type: string;
      },
    ];
    barDiameter: number;
    barQuantity: number;
    sliceLength: number;
    length: number;
  },
];

export type Response = {
  GET: BaseResponse<ByAssemblyDetail>;
};

export type RequestParams = {
  GET: {
    assemblyId: number;
  };
};
