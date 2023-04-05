// Check for client-platform, a required header

export default defineEventHandler(async (event) => {

  // const clientPlatforms = ["app", "browser", "browser-dev"];
  // let clientPlatform = event.node.req.headers["client-platform"] as string;

  // // Check if 'client-platform' header is present
  // if (!clientPlatform) {
  //   console.log(
  //     "Missing required header 'client-platform'. 'client-platform' upgraded to 'browser'"
  //   );

  //   // Add client-platform to request headers
  //   event.node.req.headers["client-platform"] = "browser";
  //   clientPlatform = "browser";
  // }

  // // Check if 'client-platform' in included in valid client platforms
  // if (!clientPlatforms.includes(clientPlatform))
  //   throw createError({
  //     statusCode: 400,
  //     statusMessage:
  //       "Required header 'client-platform' must be 'app', 'browser', or 'browser-dev' only",
  //   });  
})