import { useMemo, useState } from "react";

const useCustomer = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Mã khách hàng", fieldName: "code" },
      { header: "Tên khách hàng", fieldName: "name" },
      { header: "Số điện thoại", fieldName: "phone" },
      { header: "Email", fieldName: "email" },
      { header: "Nội dung tư vấn", fieldName: "decription" },
      { header: "Trạng thái", fieldName: "status" },
      { header: "KH tiềm năng", fieldName: "isPotential" },
    ],
    []
  );

  const tableData = [
    {
      code: "KH001",
      name: "Nguyễn Văn A",
      phone: "0987654321",
      email: "vana.nguyen@example.com",
      decription: "Quan tâm đến gói xây dựng nhà cấp 4.",
      status: "Đang tư vấn",
      isPotential: "Có",
    },
    {
      code: "KH002",
      name: "Trần Thị B",
      phone: "0912345678",
      email: "thib.tran@example.com",
      decription: "Muốn thiết kế nội thất cho chung cư.",
      status: "Tiềm năng cao",
      isPotential: "Có",
    },
    {
      code: "KH003",
      name: "Lê Văn C",
      phone: "0978123456",
      email: "vanc.le@example.com",
      decription: "Đã hoàn thành tư vấn, chờ ký hợp đồng.",
      status: "Đã chốt",
      isPotential: "Có",
    },
    {
      code: "KH004",
      name: "Phạm Thị D",
      phone: "0904567891",
      email: "thid.pham@example.com",
      decription: "Quan tâm đến dịch vụ bảo trì công trình.",
      status: "Tiềm năng trung bình",
      isPotential: "Có",
    },
    {
      code: "KH005",
      name: "Hoàng Văn E",
      phone: "0939876543",
      email: "vane.hoang@example.com",
      decription: "Muốn báo giá gói thi công trọn gói.",
      status: "Đang liên hệ lại",
      isPotential: "Có",
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useCustomer;
