import { ColumnProps } from "@/components/organism/CoreTable";
import { CellContent2 } from "@/components/organism/CoreTable/components/CellContent2";
import { Collapse, TableBody, TableCell, TableRow } from "@mui/material";
import _ from "lodash";
import { useId, useState } from "react";

type Props = {
  index: number;
  rowParent: any;
  columnsChecked: any;
  columns: ColumnProps[];
  onRowClick?: (id: number, row?: any) => void;
  nameCheck?: string;
  renderCollapse?: (item: any) => JSX.Element;
};

export default function RowLine(props: Readonly<Props>) {
  const {
    index,
    rowParent,
    columnsChecked,
    columns,
    onRowClick,
    nameCheck,
    renderCollapse,
  } = props;

  const [open, setOpen] = useState(false);

  const key = useId();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <TableBody key={key}>
      <TableRow
        data-type={index % 2 === 1}
        key={rowParent?.key ?? rowParent?.id ?? index}
        sx={{
          cursor: "pointer",
          backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
          "&:hover": { backgroundColor: "#b2e4f9" },
        }}
        onDoubleClick={() => {
          onRowClick && onRowClick(rowParent?.id, rowParent);
        }}
      >
        {_.map(columnsChecked, (column, indexColumn) => (
          <TableCell key={indexColumn}>
            <CellContent2
              open={open}
              row={rowParent}
              render={column?.render}
              fieldName={column?.fieldName}
              isNameCheck={
                column?.isNameCheck ? column?.isNameCheck(rowParent) : true
              }
              handleClick={handleClick}
              nameCheck={nameCheck}
            />
          </TableCell>
        ))}
      </TableRow>
      {open && renderCollapse && (
        <TableRow>
          <TableCell
            style={{
              maxWidth: 0,
            }}
            colSpan={columns.length + 1}
          >
            <Collapse in={open}>{renderCollapse(rowParent)}</Collapse>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
