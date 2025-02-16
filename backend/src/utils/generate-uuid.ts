import crypto from 'crypto';

export const generateUuid = (): string => {
  const uuid = crypto.randomUUID();
  return uuid;
};
