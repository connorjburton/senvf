import test from "ava";

const importFile = async () => await import("./index.js");

test("get env that was originally set on process.env", async (t) => {
  process.env.hello = "world";
  const senvf = await importFile();
  t.is(senvf.default.has("hello"), true);
  t.is(senvf.default.get("hello"), "world");
});

test("can't get process.env that was originally set on process.env", async (t) => {
  process.env.hello = "world";
  await importFile();
  t.is(typeof process.env.hello, "undefined");
});

test("can't set process.env", async (t) => {
  await importFile();
  t.is(typeof process.env.hello, "undefined");
  process.env.hello = "worldd";
  t.is(typeof process.env.hello, "undefined");
});

test("setting process.env sets senvf", async (t) => {
  const senvf = await importFile();
  process.env.foo = "bar";
  t.is(senvf.default.get("foo"), "bar");
});

test("get returns fallback if property not set", async (t) => {
  const senvf = await importFile();
  t.is(senvf.default.get("a", "b"), "b");
});

test("has returns false if property not set", async (t) => {
  const senvf = await importFile();
  t.is(senvf.default.has("ab"), false);
});

test("cannot get properties directly", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  t.is(typeof senvf.a, "undefined");
});

test("cannot set properties directly", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  t.throws(() => (senvf.b = "b"));
});
