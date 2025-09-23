const authService = require("../service/auth.service");
const tokenService = require("../service/token.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const userService = require("../service/user.service");
const emailService = require("../service/email.service");
const ApiError = require("../utils/ApiError");

/**
 * Login
 */
const login = catchAsync(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);

  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: "Invalid credentials" });
  }

  const tokens = await tokenService.generateAuthTokens(user, rememberMe);
  // return res.status(httpStatus.OK).cookie('token', tokens, { httpOnly: true}).send({ message: "Login successful", user, accessTokenExpiry: tokens.access.expires });
  return res.status(httpStatus.CREATED).send({ message: "Login successful", user, tokens });
});

/**
 * Register
 */

// req.cookies?.token?.access.token
// req.cookies?.token?.tokens.refresh.token

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(httpStatus.CREATED).send({ message: "Registration successful", user, tokens });
    // return res.status(httpStatus.CREATED).cookie('token', tokens, { httpOnly: true}).send({ message: "Registration successful", user, accessTokenExpiry: tokens.access.expires })
  }
  res.status(httpStatus.CONFLICT).send({ message: "User already exists" });
});

/**
 * Logout
 */
// const logout = catchAsync(async (req, res) => {
//   console.log({ controller: req.cookies?.token?.refresh.token})
//   await authService.logout(req.cookies?.token?.refresh.token);
//   return res.status(httpStatus.NO_CONTENT).send({ message: "Logout successful" });
// });

// ----------------------------------------------------

const logout = catchAsync(async (req, res) => {
  // Get refresh token from multiple possible sources
  let refreshToken;

  // Check cookies first (most common)
  if (req.cookies?.token?.refresh?.token) {
    refreshToken = req.cookies.token.refresh.token;
  }
  // Check if token is stored differently in cookies
  else if (req.cookies?.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  }
  // Check request body as fallback
  else if (req.body?.refreshToken) {
    refreshToken = req.body.refreshToken;
  }
  // Check Authorization header as last resort
  else if (req.headers.authorization) {
    refreshToken = req.headers.authorization.replace('Bearer ', '');
  }

  console.log({
    controller: refreshToken,
    cookies: req.cookies,
    cookieNames: Object.keys(req.cookies || {})
  });

  if (!refreshToken) {
    // Still clear cookies even if no token found
    clearAuthCookies(res);
    return res.status(httpStatus.OK).json({ message: "Logout successful" });
  }

  try {
    await authService.logout(refreshToken);
  } catch (error) {
    console.log('Token deletion error:', error.message);
    // Continue with logout even if token deletion fails
  }

  // Clear all authentication-related cookies
  clearAuthCookies(res);

  return res.status(httpStatus.OK).json({ message: "Logout successful" });
});

const clearAuthCookies = (res) => {
  // Clear different possible cookie names
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  // Clear common cookie names
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('authToken', cookieOptions);

  // Clear with different paths if needed
  res.clearCookie('token', { ...cookieOptions, path: '/api' });
  res.clearCookie('token', { ...cookieOptions, path: '/auth' });
};

// ----------------------------------------------------

/**
 * Refresh Tokens
 */
const refreshTokens = catchAsync(async (req, res) => {
  console.log(req.headers.authorization.replace('Bearer ', ''))
  const tokens = await authService.refreshAuth(req.headers.authorization.replace('Bearer ', ''));
  // res.status(httpStatus.OK).cookie('token', tokens, { httpOnly: true}).send({ message: "Tokens refreshed successfully", accessTokenExpiry: tokens.access.expires });
  res.status(httpStatus.OK).send({ message: "Tokens refreshed successfully", tokens });
});

/**
 * Forgot Password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return res.status(httpStatus.NOT_FOUND).send({ status: "fail", message: "No user found with this email" });
  }
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  if (!resetPasswordToken) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ status: "fail", message: "Error generating reset token" });
  }
  await emailService.sendResetPasswordEmail(email, resetPasswordToken);
  res.status(httpStatus.OK).send({ status: "success", message: "Password reset email sent successfully", resettoken: resetPasswordToken });
});

/**
 * Reset Password
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  const result = await authService.resetPassword(token, password);
  if (!result) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: "Password reset failed: Invalid or expired token." });
  }
  res.status(httpStatus.NO_CONTENT).send({ message: "Password reset successfully" });
});

/**
 * Send Verification Email
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send({ message: "Verification email sent successfully", verifytoken: verifyEmailToken });
});

/**
 * Verify Email
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send({ message: "Email verified successfully" });
});

module.exports = {
  login,
  register,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};