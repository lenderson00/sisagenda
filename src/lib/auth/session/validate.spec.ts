import { auth } from "@/lib/auth";
import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "../erros/unauthorized";
import { validateSession } from "./validate";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

describe("validateSession", () => {
  it("should throw an error if the session is not valid", async () => {
    (vi.mocked(auth) as any).mockResolvedValue(null);
    await expect(validateSession()).rejects.toThrow(UnauthorizedError);
  });

  it("should return the session if it is valid", async () => {
    const mockSession = {
      user: { id: "1", email: "test@test.com" },
    };

    (vi.mocked(auth) as any).mockResolvedValue(mockSession);

    const session = await validateSession();
    expect(session).toEqual({
      user: { id: "1", email: "test@test.com" },
    });
  });
});
