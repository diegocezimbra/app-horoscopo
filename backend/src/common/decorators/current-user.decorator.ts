import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../../auth/guards/jwt.guard';

/**
 * Decorator to extract current user from request
 * Usage: @CurrentUser() user: JwtUser
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): JwtUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);

/**
 * Decorator to extract user ID from request
 * Usage: @UserId() userId: string
 */
export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id || null;
  },
);
