export const formatToStringWithPx = (value: number): string => {
  return value.toString() + "px";
};

export const formatToCapitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const formatInitialUserName = (value: string): string => {
  console.log("formatInitialUserName", value);
  return value[0].toUpperCase();
};
