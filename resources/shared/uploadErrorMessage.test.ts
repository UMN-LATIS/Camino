import { describe, it, expect } from "vitest";
import uploadErrorMessage from "./uploadErrorMessage";

describe("uploadErrorMessage", () => {
  it("returns a size-limit message for a 413 (nginx-rejected)", () => {
    const error = { response: { status: 413 }, message: "Payload Too Large" };
    expect(uploadErrorMessage(error)).toMatch(/too large/i);
    expect(uploadErrorMessage(error)).toMatch(/8 MB/);
  });

  it("returns the same size-limit message for a 422 (Laravel-rejected)", () => {
    const error = { response: { status: 422 }, message: "Unprocessable" };
    expect(uploadErrorMessage(error)).toMatch(/too large/i);
    expect(uploadErrorMessage(error)).toMatch(/8 MB/);
  });

  it("returns a generic message for other HTTP errors", () => {
    expect(
      uploadErrorMessage({ response: { status: 500 }, message: "boom" }),
    ).toMatch(/couldn't upload/i);
  });

  it("returns a generic message for non-HTTP failures (no response)", () => {
    // e.g., dropped network connection — axios throws without
    // attaching a response.
    expect(uploadErrorMessage({ message: "Network Error" })).toMatch(
      /couldn't upload/i,
    );
  });

  it("tolerates a totally unknown error shape", () => {
    expect(uploadErrorMessage(null)).toMatch(/couldn't upload/i);
    expect(uploadErrorMessage(undefined)).toMatch(/couldn't upload/i);
    expect(uploadErrorMessage("just a string")).toMatch(/couldn't upload/i);
  });
});
