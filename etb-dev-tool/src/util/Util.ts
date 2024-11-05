import { base64url, JWTPayload, jwtVerify, SignJWT } from "jose";

type StackEntry = {
  file: string | null;
  column: number | null;
  line: number | null;
  functionName: string | null;
};

export type ErrorObject = {
  message: string;
  stack: StackEntry[];
};

function stripAnsiCodes(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/\u001b\[\d+m/g, "");
}

export function formatText(errorObj: unknown): string {
  const parsedObject = JSON.parse(errorObj as string);
  const { message, stack } = parsedObject as ErrorObject;
  if (message === undefined || stack === undefined) {
    return "Invalid error object";
  }

  const cleanedMessage = stripAnsiCodes(message);
  const formattedStack = stack
    .map((entry) => {
      const { file, line, column } = entry;
      return file ? `${file}:${line}:${column}` : "";
    })
    .filter(Boolean)
    .join("\n");

  return cleanedMessage + "\n" + formattedStack;
}

interface JwtPayload {
  header: any;
  payload: any;
}

export const extractDataFromJwt = (jwt: string): JwtPayload => {
  const [encodedHeader, encodedPayload] = jwt.split(".");
  const decodedHeader = base64url.decode(encodedHeader);
  const decodedPayload = base64url.decode(encodedPayload);

  const header = JSON.parse(new TextDecoder("utf-8").decode(decodedHeader));
  const payload = JSON.parse(new TextDecoder("utf-8").decode(decodedPayload));
  return { header, payload } as JwtPayload;
};

export const verifyJwt = async (
  token: string,
  secretKey: string
): Promise<JWTPayload> => {
  const encoder = new TextEncoder();
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secretKey));
    return payload;
  } catch (error) {
    return {};
  }
};

export const signJwt = async (
  header: any,
  payload: any,
  secretKey: string
): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const signedJwt = await new SignJWT(payload)
      .setProtectedHeader(header)
      .sign(encoder.encode(secretKey));
    return signedJwt;
  } catch (error) {
    return "";
  }
};
