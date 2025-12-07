import { useMemo, useState } from "react";

const useConstructionProjectList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Mã công trình", fieldName: "code" },
      { header: "Tên công trình", fieldName: "name" },
      { header: "Chủ đầu tư", fieldName: "investor" },
      { header: "Mã hợp đồng", fieldName: "contractCode" },
      { header: "Ngày kí HĐ", fieldName: "contractDate" },
      { header: "Tiến độ dự án", fieldName: "progress" },
      { header: "Chủ nhiệm dự án", fieldName: "projectManager" },
      { header: "Giá trị hợp đồng", fieldName: "contractValue" },
      { header: "Trạng thái", fieldName: "status" },
      { header: "Thời gian còn lại", fieldName: "remainingDays" },
    ],
    []
  );

  const tableData = [
    {
      code: "CT001",
      name: "Dự án Chung cư A",
      investor: "Công ty ABC",
      contractCode: "HD-2024-001",
      contractDate: "2024-02-15",
      progress: "65%",
      projectManager: "Nguyễn Văn A",
      contractValue: 1500000000,
      status: "Đang thi công",
      remainingDays: 120,
    },
    {
      code: "CT002",
      name: "Dự án Nhà máy B",
      investor: "Tập đoàn XYZ",
      contractCode: "HD-2024-002",
      contractDate: "2024-03-01",
      progress: "40%",
      projectManager: "Trần Thị B",
      contractValue: 2800000000,
      status: "Chậm tiến độ",
      remainingDays: 200,
    },
    {
      code: "CT003",
      name: "Dự án Trường học C",
      investor: "UBND Quận 5",
      contractCode: "HD-2024-003",
      contractDate: "2024-01-20",
      progress: "80%",
      projectManager: "Lê Văn C",
      contractValue: 900000000,
      status: "Đúng tiến độ",
      remainingDays: 60,
    },
    {
      code: "CT004",
      name: "Dự án Cầu D",
      investor: "Sở GTVT",
      contractCode: "HD-2024-004",
      contractDate: "2023-12-10",
      progress: "55%",
      projectManager: "Phạm Thị D",
      contractValue: 3500000000,
      status: "Đang thi công",
      remainingDays: 180,
    },
    {
      code: "CT005",
      name: "Dự án Khu nghỉ dưỡng E",
      investor: "Công ty Du lịch E",
      contractCode: "HD-2024-005",
      contractDate: "2024-04-12",
      progress: "25%",
      projectManager: "Hoàng Văn E",
      contractValue: 7200000000,
      status: "Mới khởi công",
      remainingDays: 300,
    },
    {
      code: "CT006",
      name: "Dự án Bệnh viện F",
      investor: "Sở Y tế",
      contractCode: "HD-2024-006",
      contractDate: "2024-02-01",
      progress: "50%",
      projectManager: "Đặng Thị F",
      contractValue: 5200000000,
      status: "Đang thi công",
      remainingDays: 150,
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useConstructionProjectList;
