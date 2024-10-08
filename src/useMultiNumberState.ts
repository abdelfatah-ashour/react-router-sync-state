import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { arraysAreIdentical, isStringArrayOfNumbers } from "./utils";

export function useMultiNumberState(searchParamName: string, options: { defaultValue: number[]; delimiter: string }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const acquiredSearchParam = searchParams.get(searchParamName);

  const finalValue =
    acquiredSearchParam && isStringArrayOfNumbers(acquiredSearchParam, options.delimiter)
      ? (acquiredSearchParam.split(options.delimiter).map((x) => Number(x)) as number[])
      : options.defaultValue;

  const set = (newValue: number[], replace = true) => {
    // if we are setting the default value, don't add it to the url
    if (arraysAreIdentical(newValue, options.defaultValue)) {
      searchParams.delete(searchParamName);
      setSearchParams(searchParams, { replace });
    } else {
      searchParams.delete(searchParamName);
      searchParams.append(searchParamName, newValue.join(options.delimiter));
      setSearchParams(searchParams, { replace });
    }
  };

  useEffect(() => {
    // if the url has the default value, remove it
    if (arraysAreIdentical(finalValue, options.defaultValue)) {
      searchParams.delete(searchParamName);
      setSearchParams(searchParams);
    } else {
      // if the url has an invalid value, remove it
      if (acquiredSearchParam && !isStringArrayOfNumbers(acquiredSearchParam, options.delimiter)) {
        searchParams.delete(searchParamName);
        setSearchParams(searchParams);
      }
    }
  }, []);

  return {
    value: finalValue,
    set,
  };
}
