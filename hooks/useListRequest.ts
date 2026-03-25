import { list } from "@prettylab/api/utils/crud";
import { generateApiPath } from "@prettylab/core/utils/route/route";
import { useEffect, useState } from "react";

export const useListRequest = (
  url: string,
  params?: any,
  allowRequestToExecute?: boolean,
  reloadData?: any,
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    if (
      typeof allowRequestToExecute !== "undefined" &&
      !allowRequestToExecute
    ) {
      return;
    }

    const fetchData = async () => {
      const res = await list(generateApiPath(url, params));
      return res.data || [];
    };

    fetchData()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [allowRequestToExecute, reloadData]);

  return { loading, data };
};
