import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		console.log('Endpoint called\n---------------\nmethod:\t\t', request.method, '\nurl:\t\t', request.url, '\nauth header:\t', request.headers['Authorization'], '\nbody:\t\t', request.body);

		return super.canActivate(context);
	}
}
