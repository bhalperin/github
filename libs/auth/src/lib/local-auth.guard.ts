import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	override canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();

		console.log('*** LocalAuthGuard / canActivate, endpoint called\n-------------------------------\nmethod:\t\t', request.method, '\nurl:\t\t', request.url, '\nauth header:\t', request.headers['Authorization'], '\nbody:\t\t', request.body);

		return super.canActivate(context);
	}
}
