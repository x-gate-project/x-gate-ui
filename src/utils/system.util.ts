export const delay = (timeout: number) => new Promise<void>((done) => setTimeout(done, timeout));

export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';
