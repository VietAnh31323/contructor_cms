import { useMemo, useState } from "react";

const useProgressManageList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Tên công trình", fieldName: "projectName" },
      { header: "Chủ đầu tư", fieldName: "investor" },
      { header: "Mã hợp đồng", fieldName: "contractCode" },
      { header: "Ngày kí hợp đồng", fieldName: "contractDate" },
      { header: "Tiến độ dự án", fieldName: "progress" },
      { header: "Chủ nhiệm dự án", fieldName: "manager" },
      { header: "Giá trị hợp đồng", fieldName: "contractValue" },
      { header: "Trạng thái", fieldName: "status" },
    ],
    []
  );

  const tableData = [
    {
      projectName: "Công trình A",
      investor: "CTY ABC",
      contractCode: "HD-001",
      contractDate: "2024-01-15",
      progress: "50%",
      manager: "Nguyễn Văn A",
      contractValue: "2,5 tỷ",
      status: "Đang thực hiện",
    },
    {
      projectName: "Công trình B",
      investor: "CTY XYZ",
      contractCode: "HD-002",
      contractDate: "2024-02-10",
      progress: "70%",
      manager: "Trần Văn B",
      contractValue: "3 tỷ",
      status: "Đang thực hiện",
    },
    {
      projectName: "Công trình C",
      investor: "CTY ĐT VN",
      contractCode: "HD-003",
      contractDate: "2024-03-22",
      progress: "30%",
      manager: "Lê Văn C",
      contractValue: "1,2 tỷ",
      status: "Tạm dừng",
    },
    {
      projectName: "Công trình D",
      investor: "CTY Minh Tâm",
      contractCode: "HD-004",
      contractDate: "2024-04-05",
      progress: "90%",
      manager: "Phạm Văn D",
      contractValue: "5 tỷ",
      status: "Hoàn thành",
    },
    {
      projectName: "Công trình E",
      investor: "CTY Hòa Bình",
      contractCode: "HD-005",
      contractDate: "2024-05-18",
      progress: "10%",
      manager: "Võ Văn E",
      contractValue: "4 tỷ",
      status: "Đang thực hiện",
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useProgressManageList;
