import { HttpService } from '@nestjs/axios';

export const setupAxios = () => {
	const httpService = new HttpService();

	httpService.axiosRef.interceptors.request.use(
		(request) => {
			console.log('*** request:', request.url);
			return request;
		}
	);
};
