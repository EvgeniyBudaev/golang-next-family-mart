export type TDomainErrors<TNames extends string = string> = Record<
  TNames,
  string | string[] | undefined
>;

export type TResponseFieldError = {
  message: string;
  statusCode: string;
  success: boolean;
};

export type TResponseFieldErrors = {
  [key: string]: TResponseFieldError[];
};

export type TCommonResponseError = {
  fieldErrors?: TResponseFieldErrors;
  message: string;
  statusCode: number;
  success: boolean;
};
