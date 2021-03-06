import * as jwt from "jsonwebtoken";
import { ResolverFn, Context } from "@buddy-app/schema";
import ERRORS from "./errors";

const APP_SECRET = process.env.APP_SECRET as string;

const emailValidator = (email: string): boolean =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const auth = (authToken: string): string => {
  try {
    const token = authToken.replace("Bearer ", "");
    const { userId }: any = jwt.verify(token, APP_SECRET);
    return userId;
  } catch {
    throw new ERRORS.UNAUTHENTICATED();
  }
};

const isBuddyAuth = async (context: Context): Promise<boolean> => {
  const { Authorization, authorization } = context.event.headers;

  const userId = auth(Authorization || authorization);
  const isBuddy = await context.prisma.$exists.buddy({ id: userId });

  if (!isBuddy) {
    throw new ERRORS.ACCESS_DENIED();
  }
  return isBuddy;
};

export const authMiddleware = async (
  resolve: ResolverFn<any, any, Context, any>,
  root: any,
  args: any,
  context: Context,
  info: any
): Promise<any> => {
  if (
    !/login$|sendResetPasswordLink$/.test(info.fieldName) &&
    info.parentType.name !== "AuthPayload"
  ) {
    if (
      info.operation.operation === "mutation" &&
      info.operation.name &&
      !/updateTask$|updateUser$/.test(info.operation.name.value)
    ) {
      await isBuddyAuth(context);
    } else {
      const { Authorization, authorization } = context.event.headers;
      auth(Authorization || authorization);
    }
  }

  return await resolve(root, args, context, info);
};

export const credentialsMiddleware = async (
  resolve: ResolverFn<any, any, Context, any>,
  root: any,
  args: any,
  context: Context,
  info: any
): Promise<any> => {
  if (
    /addBuddy$|addNewbie$|login$|sendResetPasswordLink$/.test(info.fieldName)
  ) {
    const input = args.input || args;
    const email = input.email || "";

    if (!email || !emailValidator(email)) {
      throw new ERRORS.INVALID_EMAIL();
    }
  }

  return await resolve(root, args, context, info);
};
