import { useEffect, useState } from "react";

function useFetch(apiFunction) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await apiFunction();

      setData(response.data || []);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFetch;