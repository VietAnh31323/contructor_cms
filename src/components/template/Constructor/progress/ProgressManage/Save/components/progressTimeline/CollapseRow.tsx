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
import SubTask from "../../Dialog/SubTask";
import { useParams, useSearchParams } from "next/navigation";

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
      isFitContent
      breadcrumbs={[
        {
          title: "Sub-task",
          content: (
            <Grid>
              <CoreTable
                className="mt-15"
                columns={[
                  {
                    header: "Mã công việc",
                    fieldName: "code",
                  },
                  {
                    header: "Người thực hiện",
                    fieldName: "taskStaffMaps",
                  },
                  {
                    header: "Ngày bắt đầu",
                    fieldName: "startTime",
                  },
                  {
                    header: "Ngày hoàn thành ",
                    fieldName: "endTime",
                  },
                  {
                    header: "Số ngày hoàn thành dự kiến",
                    fieldName: "remainingTime",
                  },
                  {
                    header: "Số giờ hoàn thành dự kiến",
                    fieldName: "statusResult",
                  },
                  {
                    header: "Trạng thái",
                    fieldName: "state",
                  },
                ]}
                data={tableData}
                isShowColumnStt
                // paginationHidden={tableData.length < 1}
              />
              <br />
              <CoreButton
                onClick={() => {
                  showDialog(
                    <SubTask
                      taskId={row}
                      onSubmitSuccess={(subTaskRow) => {
                        console.log("subTaskRow", subTaskRow);
                        setTableData((prev) => [subTaskRow, ...prev]);
                      }}
                    />
                  );
                }}
                disabled={isView}
              >
                Thêm Công việc con
              </CoreButton>
            </Grid>
          ),
        },
      ]}
    />
  );
};

export default CollapseRow;
