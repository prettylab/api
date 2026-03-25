import { list, ListResponse, read } from "@prettylab/api/utils/crud";
import messageTranslations from "@/enums/messageTranslations";
import { enqueueSnackbar } from "notistack";

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
  disableSuccessMessages?: boolean;
  disableErrorMessages?: boolean;
};

export const handleApiList = async ({
  path,
  filters,
  onInit,
  onSuccess,
  onError,
  onEnd,
  disableSuccessMessages,
  disableErrorMessages,
}: HandleApiList): Promise<ListResponse | false> => {
  onInit?.();

  try {
    const response = await list(path, filters);
    const { message, variant } = messageTranslations[response.message];

    if (response.success && !disableSuccessMessages) {
      enqueueSnackbar(message, { variant });
    }

    if (!response.success && !disableErrorMessages) {
      enqueueSnackbar(message, { variant });
    }

    onSuccess?.(response);
    return response;
  } catch (e: any) {
    onError?.(e);
    return false;
  } finally {
    onEnd?.();
  }
};

// ===========================
// ===== HANDLE API READ =====
// ===========================

type HandleApiRead = {
  path: string;
  onInit?: () => void;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  disableSuccessMessages?: boolean;
  disableErrorMessages?: boolean;
};

export const handleApiRead = async ({
  path,
  onInit,
  onSuccess,
  onError,
  onEnd,
  disableSuccessMessages,
  disableErrorMessages,
}: HandleApiRead): Promise<ListResponse | false> => {
  onInit?.();

  try {
    const response = await read(path);
    const { message, variant } = messageTranslations[response.message];

    if (response.success && !disableSuccessMessages) {
      enqueueSnackbar(message, { variant });
    }

    if (!response.success && !disableErrorMessages) {
      enqueueSnackbar(message, { variant });
    }

    onSuccess?.(response);
    return response as ListResponse;
  } catch (e: any) {
    onError?.(e);
    return false;
  } finally {
    onEnd?.();
  }
};
