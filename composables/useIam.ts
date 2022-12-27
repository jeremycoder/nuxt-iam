export default function useIam() {
  function login() {
    console.log("Login function");
  }

  function logout() {
    console.log("Logout function");
  }

  /**
   * @desc Returns true/false depending on whether the user is logged in or not
   * @returns {Promise<boolean>}
   */
  async function isAuthenticated(): Promise<boolean> {
    let authenticated = false;

    // Api response always has status, data, or error
    const { status, error } = await $fetch(
      "/api/mulozi/authn/isauthenticated",
      {
        method: "POST",
        headers: {
          "client-platform": "browser-dev",
        },
      }
    );

    if (status === "fail") {
      if (error) console.log("error: ", error);
      authenticated = false;
    }

    if (status === "success") {
      authenticated = true;
    }

    return authenticated;
  }

  return {
    login,
    logout,
    isAuthenticated,
  };
}
