import { useState, useEffect } from 'react';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

// from https://www.robinwieruch.de/react-hooks-fetch-data/
// update to use AbortController instead of didCancel, api domain alias and
// custom observer to force re-send request when necessary
export default function useFetchDataApi(
  initialUrl,
  customField,
  customObserver,
  defaultValue = null
) {
  const host = process.env.REACT_APP_API || '';
  const url = host + initialUrl;

  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(url, { signal, ...customField });
        const res = await response.json();
        setData(res);
      } catch (err) {
        setIsError(true);
        setData(defaultValue);
      }

      setIsLoading(false);
    };

    fetchData();

    return () => controller.abort();
  }, [url, customObserver, defaultValue]);

  return [data, isLoading, isError];
}
