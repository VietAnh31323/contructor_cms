import CoreNavbar from "@/components/organism/CoreNavbar";
import React, { useState } from "react";
// import QCDetail from "../components/QCDetail";
// import QCCoupon from "../components/QCCoupon";
// import { useQueryReceiptQCDetail } from "@/service/manufactory/productionSlip/getRecepi";
import router, { useRouter } from "next/router";
import { CoreTable } from "@/components/organism/CoreTable";
// import { useQueryQC } from "@/service/manufactory/productionSlip/getQC";
import { GREEN, RED } from "@/helper/colors";
import { CategoryList } from "@/service/constructor/Category/getList/type";
import { Grid } from "@mui/material";
import { CoreButton } from "@/components/atoms/CoreButton";
import { useDialog } from "@/components/hooks/dialog/useDialog";

import { useParams, useSearchParams } from "next/navigation";
import { divide } from "lodash";
import SteelChoose from "../../Dialog/steelChoose";
import { AssemblyTableRow } from "./useStep2";
import { useMutation } from "@tanstack/react-query";
import { deleteSteel } from "@/service/constructor/Steel/delete";
import { toastError, toastSuccess } from "@/toast";

const CollapseRow = ({
  row,
  onAddSteel,
}: {
  row: AssemblyTableRow;
  onAddSteel: (assemblyId: number, steel: any) => void;
}) => {
  const { showDialog } = useDialog();
  const searchParams = useSearchParams();
  const params = useParams();
  console.log("rowww", row);
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";

  const tableData = row.steels || [];
  console.log("tableData", tableData);
  const { mutate: remove } = useMutation({
    mutationFn: (id: number) => deleteSteel({ id }),
    onSuccess: () => {
      toastSuccess("Xóa cấu kiện thành công");
    },
    onError: () => {
      toastError("Lỗi khi xóa cấu kiện");
    },
  });

  return (
    <CoreNavbar
      isFitContent={true}
      breadcrumbs={[
        {
          title: "Chi tiết cấu kiện",
          content: (
            <Grid>
              <CoreTable
                tableName="aoishd"
                className="mt-15"
                columns={[
                  {
                    header: "Số hiệu",
                    fieldName: "barCode",
                  },
                  // {
                  //   header: "Tên cấu kiện",
                  //   fieldName: "name",
                  // },
                  {
                    header: "Hình dạng cấu kiện",
                    fieldName: "images",
                    render: (row: any) => {
                      const images = row.images || [];

                      if (!images.length) return "--";

                      return (
                        <div style={{ display: "flex", gap: 8 }}>
                          {images.map((url: string, index: number) => (
                            <img
                              key={index}
                              src={url}
                              alt="steel"
                              style={{
                                width: 200,
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                          ))}
                        </div>
                      );
                    },
                  },
                  {
                    header: "Đường kính (mm)",
                    fieldName: "barDiameter",
                  },
                  {
                    header: "Chiều dài thanh thép (mm) ",
                    fieldName: "steelLinesText",
                  },
                  {
                    header: "Số lượng / 1 cấu kiện",
                    fieldName: "barQuantity",
                  },
                  {
                    header: "Tổng số lượng",
                    fieldName: "statusResult",
                    render: (steelRow: any) => {
                      const sameQuantity = row.sameQuantity || 0;
                      const barQuantity = steelRow.barQuantity || 0;

                      return sameQuantity * barQuantity;
                    },
                  },

                  {
                    header: "Tổng chiều dài (m)",
                    fieldName: "totalLength",
                    render: (steelRow: any) => {
                      const sameQuantity = row.sameQuantity || 0;
                      const barQuantity = steelRow.barQuantity || 0;
                      const lengthPerBarMm = steelRow.steelLinesText || 0;

                      const totalLengthMeter =
                        (lengthPerBarMm * barQuantity * sameQuantity) / 1000;

                      return totalLengthMeter.toFixed(2);
                    },
                  },

                  {
                    header: "Tổng trọng lượng (kg)",
                    fieldName: "totalWeight",
                    render: (steelRow: any) => {
                      const lengthMm = steelRow.steelLinesText || 0;
                      const lengthM = lengthMm / 1000; // ✅ đổi sang mét

                      const barQuantity = steelRow.barQuantity || 0;
                      const diameter = steelRow.barDiameter || 0;
                      const sameQuantity = row.sameQuantity || 1;

                      const totalWeight =
                        (lengthM *
                          barQuantity *
                          diameter *
                          diameter *
                          sameQuantity) /
                        162.2;

                      return totalWeight.toFixed(2);
                    },
                  },
                  {
                    header: "",
                    fieldName: "action",
                    render: (steelRow: any) => (
                      <CoreButton
                        theme="cancel"
                        size="small"
                        onClick={() => remove(steelRow.id)}
                      >
                        Xóa
                      </CoreButton>
                    ),
                  },
                ]}
                data={tableData}
                isShowColumnStt
                paginationHidden
              />
              <br />
              <br />
              <CoreButton
                onClick={() => {
                  showDialog(
                    <SteelChoose
                      assemblyId={row.id}
                      onSuccess={(steelRow) => {
                        console.log("🔥 CollapseRow nhận:", steelRow);
                        onAddSteel(row.id, steelRow); // ⭐ ĐẨY NGƯỢC VỀ STEP2
                      }}
                    />
                  );
                }}
                disabled={isView}
              >
                Thêm thanh thép cùng cấu kiện
              </CoreButton>
            </Grid>
          ),
        },
      ]}
    />
  );
};

export default CollapseRow;
