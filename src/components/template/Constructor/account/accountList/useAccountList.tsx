import { useMemo, useState } from "react";

const useAccountList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columns = useMemo(
    () => [
      { header: "Mã nhân sự", fieldName: "code" },
      { header: "Họ và tên", fieldName: "name" },
      { header: "Ngày sinh", fieldName: "date" },
      { header: "Số điện thoại", fieldName: "phone" },
      { header: "Email", fieldName: "email" },
      { header: "Chức vụ", fieldName: "position" },
      { header: "Quyền", fieldName: "power" },
    ],
    []
  );

  const tableData = [
    {
      code: "NV001",
      name: "Nguyễn Văn A",
      date: "1990-05-12",
      phone: "0987654321",
      email: "a@example.com",
      position: "Kỹ sư",
      power: "Admin",
    },
    {
      code: "NV002",
      name: "Trần Thị B",
      date: "1988-11-23",
      phone: "0912345678",
      email: "b@example.com",
      position: "Kế toán",
      power: "User",
    },
    {
      code: "NV003",
      name: "Lê Văn C",
      date: "1992-07-08",
      phone: "0978123456",
      email: "c@example.com",
      position: "Nhân viên thi công",
      power: "User",
    },
    {
      code: "NV004",
      name: "Phạm Thị D",
      date: "1995-03-15",
      phone: "0904567891",
      email: "d@example.com",
      position: "Quản lý dự án",
      power: "Manager",
    },
    {
      code: "NV005",
      name: "Hoàng Văn E",
      date: "1985-09-30",
      phone: "0939876543",
      email: "e@example.com",
      position: "Kỹ thuật viên",
      power: "User",
    },
    {
      code: "NV006",
      name: "Đặng Thị F",
      date: "1993-12-05",
      phone: "0961234567",
      email: "f@example.com",
      position: "Nhân viên hành chính",
      power: "User",
    },
  ];

  return [
    { columns, tableData, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
};

export default useAccountList;
