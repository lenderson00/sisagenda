import { auth } from "@/lib/auth";
import { UnauthorizedError } from "../erros/unauthorized";

export const validateSession = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.id || !session.user.email) {
    throw new UnauthorizedError();
  }

  return session;
};
