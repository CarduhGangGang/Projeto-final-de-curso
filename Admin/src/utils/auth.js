import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

export const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, decoded: payload };
  } catch (err) {
    return { valid: false, error: err.message };
  }
};
