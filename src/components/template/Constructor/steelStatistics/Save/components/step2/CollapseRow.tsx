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

const CollapseRow = ({ row }: { row: any }) => {
  const { showDialog } = useDialog();
  const searchParams = useSearchParams();
  const params = useParams();
  console.log("rowww", row);
  const actionType = searchParams.get("actionType");
  const isView = actionType === "VIEW";
  // const { data, isLoading, refetch } = useQueryQC({ id: row })
  // const tableData = (data?.data ?? []).map((item) => {
  //   return {
  //     ...item,
  //     sku: item.product.sku,
  //     statusResult: item?.statusResult === true ? 'Đạt' : 'Không đạt',
  //     passQuantity:
  //       item?.quantity +
  //       '/' +
  //       item?.passQuantity +
  //       ' ' +
  //       item?.product?.uomName,
  //   }
  // })
  const [tableData, setTableData] = useState<any[]>([]);
  return (
    <CoreNavbar
      isFitContent={true}
      breadcrumbs={[
        {
          title: "Chi tiết cấu kiện",
          content: (
            <Grid>
              <CoreTable
                className="mt-15"
                columns={[
                  {
                    header: "Số hiệu",
                    fieldName: "name",
                  },
                  {
                    header: "Tên cấu kiện",
                    fieldName: "name",
                  },
                  {
                    header: "Hình dạng cấu kiện",
                    fieldName: "taskStaffMaps",
                  },
                  {
                    header: "Đường kính (mm)",
                    fieldName: "startTime",
                  },
                  {
                    header: "Chiều dài thanh thép (mm) ",
                    fieldName: "endTime",
                  },
                  {
                    header: "Số lượng / 1 cấu kiện",
                    fieldName: "remainingTime",
                  },
                  {
                    header: "Tổng số lượng",
                    fieldName: "statusResult",
                  },
                  {
                    header: "Tổng chiều dài(m)",
                    fieldName: "state",
                  },
                  {
                    header: "Tổng trọng lượng lượng(kg)",
                    fieldName: "state",
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
                  showDialog(<SteelChoose />);
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
