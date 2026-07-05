import { z } from 'zod';
import { LoginInfoSchema, type LoginInfo } from './loginInfo.js';
import { SessionInfoSchema, type SessionInfo } from './sessionInfo.js';

export type AuthSuccess = {
    loginInfo?: LoginInfo;
    session?: SessionInfo;
};

export const AuthSuccessSchema = z.lazy(() => z.looseObject({
  loginInfo: LoginInfoSchema.optional(),
  session: SessionInfoSchema.optional(),
})) as unknown as z.ZodType<AuthSuccess>;
