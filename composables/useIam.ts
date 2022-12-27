export default function useIam() {
  function login() {
    console.log("Login function");
  }

  function logout() {
    console.log("Logout function");
  }

  async function isAuthenticated() {
    const result = await $fetch("/api/mulozi/authn/authenticated", {
      method: "POST",
      headers: {
        "client-platform": "browser",
      },
    });

    console.log("isAuthenticated: ", result);
    console.log("Get authenticated!");
  }

  return {
    login,
    logout,
    isAuthenticated,
  };
}
