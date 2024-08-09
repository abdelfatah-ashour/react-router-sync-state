import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export function useQueryBooleanState(searchParamName: string, options: { defaultValue: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const acquiredSearchParam = searchParams.get(searchParamName);

  const finalValue = (["true", "false"] as any).includes(acquiredSearchParam)
    ? acquiredSearchParam === "true"
    : options.defaultValue;

  const set = (newValue: boolean, replace = true) => {
    // if we are setting the default value, don't add it to the url
    if (newValue.toString() === options.defaultValue.toString()) {
      searchParams.delete(searchParamName);
      setSearchParams(searchParams, { replace });
    } else {
      searchParams.delete(searchParamName);
      searchParams.append(searchParamName, newValue.toString());
      setSearchParams(searchParams, { replace });
    }
  };

  useEffect(() => {
    // if the url has the default value, remove it
    if (finalValue === options.defaultValue) {
      searchParams.delete(searchParamName);
      setSearchParams(searchParams);
    } else {
      // if the url has an invalid value, remove it
      if (acquiredSearchParam && !["true", "false"].includes(acquiredSearchParam)) {
        searchParams.delete(searchParamName);
        setSearchParams(searchParams);
      }
    }
  }, []);

  return {
    value: finalValue,
    set,
    toggle: () => {
      set(!finalValue);
    },
  };
}
