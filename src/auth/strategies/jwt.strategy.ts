import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensure token expiration is checked
      secretOrKey: 'your_secret_key',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('Validating payload:', payload);
    const user = await this.userService.findOneById(payload.sub);
    if (!user) {
      console.error(`User with id ${payload.sub} not found`);
      throw new UnauthorizedException();
    }
    return user;
  }
}
