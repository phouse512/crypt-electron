
export const queryParams = (params) => {
  const keys = Object.keys(params)
  return keys.length
      ? "?" + keys
          .map(key => encodeURIComponent(key)
              + "=" + encodeURIComponent(params[key]))
          .join("&")
      : ""
};
