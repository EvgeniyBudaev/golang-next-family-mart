export type TApiFunction<TParams, TResponse> = (params: TParams) => Promise<TResponse>;
