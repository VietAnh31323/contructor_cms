import CoreNavbar from "@/components/organism/CoreNavbar";
import React from "react";
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

const CollapseRow = ({ row }: { row: any }) => {
  const { showDialog } = useDialog();
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
  const tableData: CategoryList[] = [];
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
                    header: "Mã phiếu",
                    fieldName: "code",
                  },
                  {
                    header: "SKU",
                    fieldName: "sku",
                  },
                  {
                    header: "Số lượng đạt",
                    fieldName: "passQuantity",
                  },
                  {
                    header: "Kết quả",
                    fieldName: "statusResult",
                  },
                ]}
                data={tableData}
                isShowColumnStt
                paginationHidden={tableData.length < 1}
              />
              <br />
              <CoreButton
                onClick={() => {
                  showDialog(<SubTask />);
                }}
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
