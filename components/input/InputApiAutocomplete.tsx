import { useEffect, useMemo, useRef, useState } from "react";
import { SelectProps } from "@mui/material";
import InputAutocomplete, {
  UncontrolledInputAutocompleteSlotProps,
} from "@prettylab/core/components/input/InputAutocomplete";
import { useDebounce } from "@prettylab/core/hooks/useDebounce";
import { ListResponse } from "@prettylab/api/utils/crud";
import getValue from "@prettylab/core/utils/data/getValue";
import { handleApiList } from "@prettylab/api/utils/handler";

export type UncontrolledInputApiAutocompleteProps = Omit<
  SelectProps<string>,
  "options"
> & {
  url: string;
  path?: string;
  filters?: any;
  optionRender?: (option: any) => any;
  onLoad?: (data: any) => void;
  value?: any;
  onChange?: (event: any, value: any) => void;
  disableSearch?: boolean;
  multiple?: boolean;
  slotProps?: UncontrolledInputAutocompleteSlotProps;
};

export default function InputApiAutocomplete({
  url,
  path = "data",
  optionRender = (option) => option,
  onLoad,
  filters,
  value,
  onChange,
  disableSearch,
  multiple,
  slotProps,
  ...props
}: UncontrolledInputApiAutocompleteProps) {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const debouncedValue = useDebounce(inputValue, 200);
  const enableSearching = useRef(false);

  useEffect(() => {
    if (disableSearch) return;

    const assignValues = async () => {
      if (
        (!!value || value?.length > 0) &&
        data.find((row: any) => row.id === value?.id)?.label
      ) {
        setInputValue(
          data.find((row: any) => row.id === value?.id)?.label || "",
        );

        fetchData({ q: "", includeIds: [value?.id] });
      }
    };

    if (!multiple) {
      assignValues();
      return;
    }
  }, [value]);

  useEffect(() => {
    if (disableSearch) return;

    if (multiple) {
      fetchData({
        ...(Array.isArray(value) &&
          value?.length > 0 && {
            includeIds: value.map((row: any) => row.id),
            limit: 50 + value.length,
          }),
      });
      return;
    }

    if (!value || enableSearching.current) {
      fetchData();
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (disableSearch) {
      fetchData();
    }
  }, [disableSearch]);

  const options = useMemo(() => {
    if (multiple) {
      return [...data]
        .filter((row) => !filters?.notIds?.includes(row.id))
        .sort((a, b) => {
          if (!Array.isArray(value)) return 0;

          return value.some((row: any) => row.id === a.id) ===
            value.some((row: any) => row.id === b.id)
            ? 0
            : value.some((row: any) => row.id === a.id)
              ? -1
              : 1;
        });
    }

    return data.filter((row) => !filters?.not_ids?.includes(row.id));
  }, [value, data]);

  const fetchData = async (forceFilters?: any): Promise<ListResponse | any> => {
    const searchForAll =
      !!value &&
      debouncedValue === data.find((row: any) => row.id === value?.id)?.label;

    const response = await handleApiList({
      path: url,
      filters: {
        limit: disableSearch
          ? 500
          : 50 +
            (forceFilters?.includeIds?.length ||
              (!!value && !multiple ? 1 : 0)),
        q: disableSearch ? "" : searchForAll ? "" : debouncedValue,
        // ...(!!value && !multiple && { includeIds: [value] }),
        ...filters,
        ...forceFilters,
      },
      onEnd: () => setLoading(false),
    });

    const fetchedData = parseDependency(response, path);
    if (JSON.stringify(data) === JSON.stringify(fetchedData)) {
      return response || {};
    }

    onLoad?.(fetchedData);
    setData(fetchedData.map(optionRender));

    return response || {};
  };

  const parseDependency = (dependency: any, path: any) => {
    return getValue(dependency, path);
  };

  if (disableSearch) {
    return (
      <InputAutocomplete
        options={options.map((row: any) => ({ ...row, key: row.id }))}
        {...props}
        value={value}
        onChange={(event: any, value: any) => {
          if (onChange) onChange(event, value);
        }}
        loading={loading}
        slotProps={slotProps}
        multiple={multiple}
      />
    );
  }

  return (
    <InputAutocomplete
      options={options.map((row: any) => ({ ...row, key: row.id }))}
      {...props}
      value={value}
      onChange={(event: any, value: any, reason: string) => {
        if (reason === "selectOption") {
          enableSearching.current = false;
        }

        if (onChange) {
          onChange(event, value);
        }

        if (value === null) {
          setInputValue("");
          return;
        }

        setInputValue(multiple ? "" : value.label);
      }}
      slotProps={{
        ...slotProps,
        autocomplete: {
          ...(slotProps as any)?.autocomplete,
          inputValue,
          onInputChange: (_: any, newInput: string, reason: string) => {
            if (reason === "input" && !loading) {
              setInputValue(newInput);
              enableSearching.current = true;
            }
          },
          filterOptions: (x: any[]) => x,
          autoSelect: false,
          selectOnFocus: false,
          clearOnBlur: false,
          handleHomeEndKeys: true,
          onClose: (event: any, reason: any) => {
            const currentLabel = data.find(
              (row: any) => row.id === value,
            )?.label;

            if (
              reason === "selectOption" &&
              !multiple &&
              event.target.textContent === currentLabel
            ) {
              setInputValue(currentLabel || "");
            }
          },
        },
      }}
      loading={loading}
      multiple={multiple}
    />
  );
}
