import React from 'react';
import {
  SingleInputDateRangeField,
  SingleInputDateRangeFieldProps,
} from '@mui/x-date-pickers-pro/SingleInputDateRangeField';

export const CustomSingleInputDateRangeField = React.forwardRef(
  function CustomField(
    props: SingleInputDateRangeFieldProps<any>,
    ref: React.Ref<HTMLDivElement>,
  ) {
    return (
      <SingleInputDateRangeField
        {...props}
        ref={ref}
        inputProps={{
          ...props.inputProps,
          placeholder: props?.inputProps?.placeholder ?? 'DD/MM/YYYY - DD/MM/YYYY',
        }}
      />
    );
  }
);
