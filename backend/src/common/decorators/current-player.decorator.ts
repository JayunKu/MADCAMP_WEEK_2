import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentPlayer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.player;
  },
);
