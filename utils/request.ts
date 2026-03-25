import message, { matchMessageMeta } from "@prettylab/prisma/message/message";
import { notify } from "@prettylab/notify/notify";
import messageTranslations from "@/enums/messageTranslations";
import isClient from "@prettylab/core/utils/ssr/isClient";
import isServer from "@prettylab/core/utils/ssr/isServer";

export async function GET(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  return handleResponse(res, true);
}

export async function POST(url: string, body: string) {
  const res = await fetch(url, {
    method: "POST",
    body,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  return handleResponse(res);
}

export async function PATCH(url: string, body?: string) {
  const res = await fetch(url, {
    method: "PATCH",
    body,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  });

  return handleResponse(res);
}

export async function DELETE(url: string) {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  return handleResponse(res);
}

async function handleResponse(res: Response, disableSuccess?: boolean) {
  const data = await res.json().catch(() => {
    const { message: translationMessage, variant } =
      messageTranslations[message.INTERNAL_SERVER_ERROR];

    if (isClient()) {
      notify(translationMessage, { variant });
    }

    if (isServer()) {
      console.log(translationMessage);
    }
  });

  const isSuccess = matchMessageMeta[data.message]?.success || false;
  if (!disableSuccess || (disableSuccess && !isSuccess)) {
    const { message: translationMessage, variant } =
      messageTranslations[data.message];

    if (isClient()) {
      notify(translationMessage, { variant });
    }

    if (isServer()) {
      console.log(translationMessage);
    }
  }

  return { ...data, success: isSuccess };
}
