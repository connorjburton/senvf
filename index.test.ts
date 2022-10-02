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
  process.env.hello = "world";
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

// even those these tests are not type safe, this package can be used
// outside of TS, so we still need to test

test("can be set to number", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  process.env.foo = 1;
  t.is(senvf.default.get("foo"), 1);
});

test("can be set to object", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  process.env.foo = { a: "b" };
  t.deepEqual(senvf.default.get("foo"), { a: "b" });
});

test("can be set to array", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  process.env.foo = ["a", "b"];
  t.deepEqual(senvf.default.get("foo"), ["a", "b"]);
});

test("can be set to null", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  process.env.foo = null;
  t.is(senvf.default.get("foo"), null);
});

test("can be set to function", async (t) => {
  const senvf = await importFile();
  // @ts-ignore
  process.env.foo = () => {};
  t.is(typeof senvf.default.get("foo"), "function");
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
