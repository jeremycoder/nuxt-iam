/* Authentication controller
 * Routes all authentication requests
 */
import { createRouter, defineEventHandler } from "h3";
import {
  register,
  login,
  loginWithGoogle,
  profile,
  update,
  refresh,
  logout,
  isauthenticated,
  destroy,
  reset,
  verifyReset,
  verifyEmail,
  verifyEmailToken,
} from "./model";

const router = createRouter();

// Get user profile
router.get('/profile', defineEventHandler(async (event) => { 
  return await profile(event) 
}));

// Check if user is authenticated
router.get('/isauthenticated', defineEventHandler(async (event) => { 
  return await isauthenticated(event) 
}));

// Get user profile
router.post('/register', defineEventHandler(async (event) => { 
  return await register(event) 
}));

// Log user in
router.post('/login', defineEventHandler(async (event) => { 
  return await login(event) 
}));

// Login with Google
router.post('/login-google', defineEventHandler(async (event) => { 
  return await loginWithGoogle(event) 
}));

// Refresh JSON web tokens
router.post('/refresh', defineEventHandler(async (event) => { 
  return await refresh(event) 
}));

// Verify password reset token
router.post('/reset', defineEventHandler(async (event) => { 
  return await reset(event) 
}));

// Verify password reset token
router.post('/verifyreset/:token', defineEventHandler(async (event) => { 
  return await verifyReset(event) 
}));

// send email to verify user email
router.post('/verifyemail', defineEventHandler(async (event) => { 
  return await verifyEmail(event) 
}));

// verify token sent from user's email verification link
router.post('/verifyemailtoken', defineEventHandler(async (event) => { 
  return await verifyEmailToken(event) 
}));

// logout
router.post('/logout', defineEventHandler(async (event) => { 
  return await logout(event) 
}));

// Update user profile
router.put('/update', defineEventHandler(async (event) => { 
  return await update(event) 
}));

// Delete user profile
router.delete('/delete', defineEventHandler(async (event) => { 
  return await destroy(event) 
}));

export default useBase('/api/iam/authn', router.handler);
