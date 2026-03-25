import { list, ListResponse } from "@prettylab/api/utils/crud";

// ===========================
// ===== HANDLE API LIST =====
// ===========================

type HandleApiList = {
  path: string;
  filters?: any;
  onInit?: () => void;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
};

export const handleApiList = async ({
  path,
  filters,
  onInit,
  onSuccess,
  onError,
  onEnd,
}: HandleApiList): Promise<ListResponse | false> => {
  onInit?.();

  try {
    const response = await list(path, filters);

    onSuccess?.(response);
    return response;
  } catch (e: any) {
    onError?.(e);
    return false;
  } finally {
    onEnd?.();
  }
};
