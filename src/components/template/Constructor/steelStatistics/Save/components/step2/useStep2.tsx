import { useMemo } from "react";

export default function useStep2() {
  const columns = useMemo(
    () => [
      {
        header: "Tên cấu kiện",
        fieldName: "name",
      },
      {
        header: "Số lượng cấu kiện giống nhau",
        fieldName: "quantity",
      },
    ],
    []
  );
  const tableData = [
    {
      name: "Dầm móng",
      quantity: 12,
    },
    {
      name: "Cột bê tông cốt thép",
      quantity: 24,
    },
    {
      name: "Sàn tầng 1",
      quantity: 1,
    },
    {
      name: "Sàn tầng 2",
      quantity: 1,
    },
    {
      name: "Dầm biên",
      quantity: 18,
    },
    {
      name: "Móng đơn",
      quantity: 30,
    },
  ];
  return [{}, { columns, tableData }] as const;
}
