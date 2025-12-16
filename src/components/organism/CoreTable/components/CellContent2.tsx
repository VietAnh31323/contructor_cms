import { CurrencyFormatCustom } from "@/components/atoms/CurrencyFormatCustom";
import { useDate } from "@/components/hooks/date/useDate";
import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import _ from "lodash";

type Props = {
  row: any;
  open?: boolean;
  render?: any;
  fieldName?: string;
  handleClick?: any;
  nameCheck?: string;
  isNameCheck: boolean;
};

export const CellContent2 = (props: Props) => {
  const { render, open, row, fieldName, handleClick, nameCheck, isNameCheck } =
    props;
  const { checkDateValid, convertToDate } = useDate();

  if (row && render) {
    return render(row);
  }

  if (row && fieldName) {
    const val = _.get(row, fieldName);

    if (fieldName === nameCheck && isNameCheck)
      return (
        <button
          className="border-none cursor-pointer bg-inherit flex items-center"
          onClick={() => handleClick()}
          type="button"
        >
          {val ?? "--"} {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </button>
      );

    if (_.isNumber(val)) return <CurrencyFormatCustom amount={val} />;

    if (checkDateValid(val)) {
      return convertToDate(val);
    } else if (val === null) {
      return "--";
    }
    return val;
  }

  return null;
};
