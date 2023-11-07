type TFieldErrors = Record<string, string[]>;

type TResolverError = {
  error: {
    flatten: () => {
      fieldErrors: TFieldErrors;
    };
  };
};

type TErrorsResolverResponse = {
  [field: string]: string[];
};

type TGetErrorsResolver = (resolver: TResolverError) => TErrorsResolverResponse;

export const getErrorsResolver: TGetErrorsResolver = (resolver) => {
  return Object.fromEntries(
    Object.entries(resolver.error.flatten().fieldErrors).map(([field, errors]) => {
      return [field, errors];
    }),
  );
};
