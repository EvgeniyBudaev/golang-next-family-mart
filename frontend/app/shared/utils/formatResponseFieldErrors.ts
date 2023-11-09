import { TDomainErrors, TResponseFieldErrors } from "@/app/shared/types/error";

export function formatResponseFieldErrors(fieldErrors: TResponseFieldErrors): TDomainErrors {
  return <TDomainErrors<string>>Object.entries(fieldErrors).reduce((acc, [key, fieldErrorList]) => {
    const messages = fieldErrorList.map((item) => item.message);

    if (!messages.length) {
      return acc;
    }

    return {
      ...acc,
      [key]: messages,
    };
  }, {} as TDomainErrors);
}
