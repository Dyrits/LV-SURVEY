import test from "node:test";
import assert from "node:assert/strict";
import { surveyExpirationForInput } from "./survey-expiration.js";

test("a survey without expiration can be reopened", () => {
  assert.equal(surveyExpirationForInput(null), null);
  assert.equal(surveyExpirationForInput(undefined), null);
  assert.equal(surveyExpirationForInput(""), null);
});

test("SQL and ISO dates retain the existing form date", () => {
  assert.equal(surveyExpirationForInput("2026-12-09 00:00:00"), "2026-12-09");
  assert.equal(surveyExpirationForInput("2026-12-09T00:00:00.000000Z"), "2026-12-09");
});
