type Env = Record<string, unknown>;

const env: Env = Object.keys(process.env).reduce<Env>((obj, key) => {
  obj[key] = process.env[key];
  return obj;
}, Object.create(null)); // removes prototype to avoid conflicts in keys

export const get = (prop: string, fallback?: unknown): unknown =>
  typeof env[prop] !== "undefined" ? env[prop] : fallback;
export const has = (prop: string) => prop in env;

const handler = {
  set(_: unknown, prop: string, value: unknown): boolean {
    env[prop] = value;
    return true;
  },
};

// would probably be ideal to `delete process.env` but for type safety reasons we can't
process.env = {};
process.env = new Proxy(process.env, handler) as NodeJS.ProcessEnv;

export default Object.freeze({ get, has });
