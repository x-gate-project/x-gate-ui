export const getEnv = (name: string) =>
  ({
    ...(typeof window !== 'undefined' && window['env'] ? window['env'] : {}),
    ...process.env,
  }[name]);
