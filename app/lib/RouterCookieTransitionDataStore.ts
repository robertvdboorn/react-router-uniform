import {
  CookieTransitionDataStore,
  CookieTransitionDataStoreOptions,
  UNIFORM_DEFAULT_COOKIE_NAME,
  UNIFORM_DEFAULT_QUIRK_COOKIE_NAME,
} from "@uniformdev/context";
import { parse } from "cookie";

export type RouterCookieTransitionDataStoreOptions = Omit<
  CookieTransitionDataStoreOptions,
  "serverCookieValue"
> & {
  request?: Request;
};

/**
 * UNIFORM ADAPTER: React Router Request → Uniform Cookie Store
 * 
 * Reads personalization scores/quirks from cookies for SSR.
 * Equivalent to NextCookieTransitionDataStore but uses React Router's Request API.
 */
export class RouterCookieTransitionDataStore extends CookieTransitionDataStore {
  constructor({ request, ...options }: RouterCookieTransitionDataStoreOptions) {
    super({
      ...options,
      serverCookieValue: getRouterServerCookieValue(request),
      quirkCookieValue: options.experimental_quirksEnabled
        ? getRouterServerCookieValue(
            request,
            options.quirkCookieName || UNIFORM_DEFAULT_QUIRK_COOKIE_NAME
          )
        : undefined,
    });
  }
}

/**
 * Extract cookie value from React Router Request
 */
function getRouterServerCookieValue(
  request: Request | undefined,
  cookieName = UNIFORM_DEFAULT_COOKIE_NAME
): string | undefined {
  if (!request) return undefined;
  
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return undefined;
  
  const cookies = parse(cookieHeader);
  return cookies[cookieName];
}
