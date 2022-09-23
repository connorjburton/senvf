type Env = Record<string, string | undefined>;

const env: Env = Object.keys(process.env).reduce<Env>((obj, key) => {
  obj[key] = process.env[key];
  return obj;
}, {});

export const get = (prop: string, fallback?: string | undefined): unknown =>
  env[prop] ?? fallback;
export const has = (prop: string) => prop in env;

const handler = {
  set(_: unknown, prop: string, value: string): boolean {
    env[prop] = value;
    return true;
  },
};

process.env = {};
process.env = new Proxy(process.env, handler) as NodeJS.ProcessEnv;

export default Object.freeze({ get, has });
