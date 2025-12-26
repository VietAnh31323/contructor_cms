import { CoreAutoChip } from "@/components/atoms/CoreAutoChip";
import { PAGE_SIZE } from "@/helper/contain";
import { getPlaceholder } from "@/helper/getPlaceholder";
import { PageResponse } from "@/service/type";
import { toastError } from "@/toast";
import {
  Autocomplete,
  AutocompleteProps,
  Box,
  CircularProgress,
  FilterOptionsState,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useDebounce } from "@uidotdev/usehooks";
import { get, join } from "lodash";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller } from "react-hook-form";

const handleRule = (rules: any, multiple?: boolean) => {
  if (!!multiple && !!rules?.required) {
    return {
      validate: {
        ...rules?.validate,
        requiredReplace: (val: any[]) =>
          (!!val?.length && val?.length > 0) || rules.required,
      },
    };
  } else {
    return rules;
  }
};

export interface FormControlAutoCompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    "renderInput" | "options"
  > {
  control: any;
  name: string;
  label?: any;
  placeholder?: any;
  rules?: any;
  disabled?: boolean;
  readOnly?: boolean;
  valuePath?: string;
  labelPath?: string;
  labelPathDisplay?: string[];
  labelPathDisplayIsView?: string[];
  isHasMessageError?: boolean;
  helperText?: string;
  required?: boolean;
  params?: any;
  variant?: "outlined" | "filled" | "standard";
  isViewProp?: boolean;
  exceptValues?: any[];
  hasAllOption?: boolean;
  fetchDataFn: (val: any) => Promise<PageResponse<any>>;
  onChangeValue?: (val: any) => void;
  onAfterChangeValue?: () => void;
  beforeLabelPath?: string;
}

const CoreAutoCompleteAPI: <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  prop: FormControlAutoCompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => React.ReactElement<
  FormControlAutoCompleteProps<T, Multiple, DisableClearable, FreeSolo>
> = (props) => {
  const { t } = useTranslation();

  const {
    control,
    name,
    multiple,
    placeholder,
    rules,
    label,
    disabled,
    readOnly,
    valuePath = "id",
    labelPath = "name",
    labelPathDisplay = [labelPath],
    labelPathDisplayIsView = [labelPath],
    isHasMessageError = true,
    helperText,
    required,
    params,
    variant = "standard",
    isViewProp,
    exceptValues,
    hasAllOption,
    fetchDataFn,
    onChangeValue,
    onAfterChangeValue,
    beforeLabelPath,
    ...restProps
  } = props;

  const router = useRouter();
  const { actionType } = router.query;
  const isView = isViewProp ?? actionType === "VIEW";

  const [page, setPage] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 700);
  const [data, setData] = useState<any>([]);
  const [dataPage0, setDataPage0] = useState<any>([]);

  const convertParam = JSON.stringify(params);
  const convertExceptValues = JSON.stringify(exceptValues);

  const filterOptions = useCallback(
    (options: any[]) =>
      exceptValues
        ? options.filter((obj) =>
            exceptValues.every(
              (item: any) => item[valuePath] !== obj[valuePath]
            )
          )
        : options,
    [exceptValues, valuePath]
  );

  const handleSearchData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchDataFn({
      page: 0,
      size: PAGE_SIZE,
      search: debounceSearch,
      ...(params || {}),
    });

    if (data && Array.isArray(data.data.content)) {
      const dataValue = [
        ...data.data.content.map((item: any) => ({
          ...item,
          [labelPath]: get(item, labelPath),
          [valuePath]: get(item, valuePath),
        })),
      ];

      setData(filterOptions(dataValue));
    }

    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, convertParam]);

  const handleFetchData = useCallback(
    async (isPreApply: boolean, pageOption?: number) => {
      try {
        setIsLoading(true);
        const pageValue = pageOption ?? page;

        if (pageValue !== 0 && pageValue >= totalPages) {
          setIsLoading(false);
          return;
        }
        const data = await fetchDataFn({
          page: pageValue,
          size: PAGE_SIZE,
          ...(params || {}),
        });

        if (data && Array.isArray(data.data.content)) {
          const dataValue = data.data.content.map((item: any) => ({
            ...item,
            [labelPath]: get(item, labelPath),
            [valuePath]: get(item, valuePath),
          }));

          if (pageValue === 0) {
            setDataPage0(dataValue);
          }
          setData((prev: any) =>
            filterOptions([...(!isPreApply ? [] : prev), ...dataValue])
          );
          setTotalPages(data.data.totalPages);
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toastError(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, totalPages, convertParam]
  );

  useEffect(() => {
    if (isClick && !disabled && !readOnly)
      handleFetchData(false).catch(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClick, convertParam, convertExceptValues]);

  useEffect(() => {
    if (isClick && !disabled && !readOnly) {
      if (debounceSearch) {
        handleSearchData().catch((e) => console.log(e));
      } else {
        setPage(() => 0);
        setData(dataPage0);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, convertParam]);

  const handleScroll = (e: any) => {
    const listBoxNode = e.currentTarget;
    const currentHeight = listBoxNode.scrollTop + listBoxNode.clientHeight;

    if (listBoxNode.scrollHeight - currentHeight <= 1) {
      setPage((prev) => prev + 1);
      handleFetchData(true, page + 1).catch((e) => console.log(e));
    }
  };

  const finalData =
    (!debounceSearch || debounceSearch.toLocaleLowerCase() === "all") &&
    hasAllOption
      ? [
          {
            [valuePath]: null,
            [labelPath]: t("option.ALL"),
          },
          ...data,
        ]
      : data;

  const formatOptionLabel = (option: any) =>
    join(
      labelPathDisplay.map((key) => get(option, key)),
      labelPath === t("option.ALL") ? " " : " - "
    );

  return (
    <Box
      onClick={() => {
        if (!readOnly && !disabled && !isView && !isClick) setIsClick(true);
      }}
    >
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { error },
        }) => {
          return (
            <Autocomplete
              forcePopupIcon={!isView}
              multiple={multiple}
              disableCloseOnSelect={multiple}
              value={value ?? (multiple ? [] : null)}
              options={finalData?.length > 0 ? finalData : []}
              disabled={disabled}
              readOnly={readOnly || isView}
              loading={isLoading}
              noOptionsText={"Không có lựa chọn"}
              onBlur={() => {
                onBlur();
                if (!value && hasAllOption) {
                  onChange({
                    [valuePath]: null,
                    [labelPath]: t("option.ALL"),
                  });
                }
              }}
              onChange={(_, value: any) => {
                onChange(value);
                if (onChangeValue) onChangeValue(value);
                if (onAfterChangeValue) onAfterChangeValue();
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <CoreAutoChip
                    {...getTagProps({ index })}
                    title={formatOptionLabel(option)}
                    label={formatOptionLabel(option)}
                    key={get(option, valuePath)}
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => {
                if (value instanceof Object) {
                  return get(option, valuePath) === get(value, valuePath);
                }
                return get(option, valuePath) === value;
              }}
              getOptionLabel={(option) => formatOptionLabel(option)}
              renderOption={(props, option: any) => {
                return (
                  <li {...props} key={get(option, valuePath)}>
                    <Typography variant="body2" title={get(option, labelPath)}>
                      {formatOptionLabel(option)}
                    </Typography>
                  </li>
                );
              }}
              filterOptions={(options, params: FilterOptionsState<any>) => {
                setSearch(params.inputValue);
                return options;
              }}
              renderInput={(params) => (
                <>
                  <TextField
                    {...params}
                    variant={isView ? "standard" : (variant as any)}
                    inputRef={ref}
                    label={label}
                    error={!!(error || helperText)}
                    helperText={error && isHasMessageError && error.message}
                    placeholder={getPlaceholder(
                      t,
                      "autocomplete",
                      placeholder,
                      label,
                      isView,
                      value,
                      multiple
                    )}
                    InputLabelProps={{
                      // ...params.InputLabelProps,
                      shrink: true,
                      required,
                    }}
                    InputProps={{
                      disableUnderline: isView,
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                  {helperText && <FormHelperText>{helperText}</FormHelperText>}
                </>
              )}
              ListboxProps={{ onScroll: handleScroll }}
              {...restProps}
            />
          );
        }}
        rules={!isView ? handleRule(rules, multiple) : {}}
      />
    </Box>
  );
};

export default React.memo(CoreAutoCompleteAPI);
