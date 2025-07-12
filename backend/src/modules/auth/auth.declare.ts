import { SessionPayload } from './session/session.payload';

// express-session 모듈의 SessionData를 override
declare module 'express-session' {
  export interface SessionData {
    auth: SessionPayload;
  }
}

// express 모듈의 Request를 override
declare module 'express' {
  export interface Request {
    keyAuth?: boolean;
    user?: User;
  }
}
