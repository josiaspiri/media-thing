import { describe, expect, test } from "bun:test";
import { RESPONSES } from "../responses";

describe("responses.unsatisfiable", () => {
  test("responds with 416", () => {
    expect(RESPONSES.UNSATISFIABLE(123).status).toBe(416);
  });

  test("responds with appropriate range header", () => {
    expect(RESPONSES.UNSATISFIABLE(123).headers.get("Content-Range")).toBe(
      "bytes */123",
    );
  });
});
