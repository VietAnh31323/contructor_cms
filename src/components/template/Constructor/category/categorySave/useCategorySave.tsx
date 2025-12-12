import router from "next/router";
import { useMemo, useState } from "react";

export default function CustomerSave() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { actionType } = router.query;
  const isView = actionType === "VIEW";

  return [
    { isView, page, rowsPerPage },
    { setPage, setRowsPerPage },
  ];
}
