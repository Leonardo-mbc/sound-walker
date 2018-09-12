export async function request(
  endpoint: RequestInfo,
  options?: RequestInit
): Promise<Response> {
  return fetch(endpoint, {
    ...options,
  });
}
