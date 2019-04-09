import { useState, useEffect } from 'react';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

// from https://www.robinwieruch.de/react-hooks-fetch-data/
// update to use AbortController instead of didCancel
// this is also an alias so don't need to append
// REACT_APP_API for each url request
export default function useFetchDataApi(initialUrl) {
  const host = process.env.REACT_APP_API || '';
  const url = host + initialUrl;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);

      try {
        const response = await fetch(url, { signal });
        const res = await response.json();
        setData(res);
      } catch (err) {
        setIsError(true);
        setData([]);
      }

      setIsLoading(false);
    };

    fetchData();

    return () => controller.abort();
  }, [url]);

  return [data, isLoading, isError];
}
