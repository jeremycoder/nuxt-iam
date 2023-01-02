/** Global middleware for Mulozi
 */
import { H3Event, H3Error } from "h3";

/**
 * @desc Checks header for client-platform value ('app', 'browser', or 'browser-dev')
 * @param event H3 Event passed from api
 * @info Allows us to create a more secure backend for frontend strategy
 * @returns {<H3Error|void>} Object mentioning success or failure of refreshing user's tokens
 */
export function getClientPlatform(event: H3Event): H3Error | string {
  const clientPlatforms = ["app", "browser", "browser-dev"];
  let clientPlatform = event.node.req.headers["client-platform"] as string;

  // Check if 'client-platform' header is present
  if (!clientPlatform) {
    console.log(
      "Missing required header 'client-platform'. 'client-platform' upgraded to 'browser'"
    );

    // Add client-platform to request headers
    event.node.req.headers["client-platform"] = "browser";
    clientPlatform = "browser";
  }

  // Check if 'client-platform' header is either 'app' or 'browser'
  if (!clientPlatforms.includes(clientPlatform))
    return createError({
      statusCode: 400,
      statusMessage:
        "Required header 'client-platform' must be 'app', 'browser', or 'browser-dev' only",
    });

  return clientPlatform;
}
