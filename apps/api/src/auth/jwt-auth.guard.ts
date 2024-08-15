import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		console.log('Endpoint called\n---------------\nmethod:\t\t', request.method, '\nurl:\t\t', request.url, '\nauth header:\t', request.headers['authorization'], '\nbody:\t\t', request.body);

		return super.canActivate(context);
	}
}
