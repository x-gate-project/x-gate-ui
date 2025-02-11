export const getAbsoluteURL = (url: string, req: any | undefined = undefined) => {
  let host;
  if (req && req.headers) {
    host = req.headers.host;
  } else {
    if (typeof window === 'undefined') {
      throw new Error('The "req" parameter must be provided if on the server side.');
    }
    host = window.location.host;
  }
  const isLocalhost = host.indexOf('localhost') === 0;
  const protocol = isLocalhost ? 'http' : 'https';
  return `${protocol}://${host}${url}`;
};

export const truncateEthAddress = (address: string) => {
  const match = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
