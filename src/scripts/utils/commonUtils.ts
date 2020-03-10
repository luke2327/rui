export default {
  errToString: (params: Error | string): string => {
    return params instanceof Error
      ? params.toString()
      : params;
  }
}