import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '@/config/auth';
import { AppError } from '@/utils/AppError';

interface ITokenPauload {
  role: string
  sub: string;
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('JWT token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as ITokenPauload;

    request.user = {
      id: user_id,
      role,
    }

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}