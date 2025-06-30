import { SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET);

export const generateAdminToken = async () => {
  const payload = {
    role: 'admin',
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(SECRET);

  return jwt;
};
