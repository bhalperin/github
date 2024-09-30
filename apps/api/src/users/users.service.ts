import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { globalConfig } from '../config/config';
import { PrismaService } from '../prisma/prisma.service';

export type User = {
	id: number;
	email: string;
	password: string | null;
	refreshToken?: string;
};

@Injectable()
export class UsersService {
	constructor(
		@Inject(globalConfig.KEY) private readonly config: ConfigType<typeof globalConfig>,
		private prisma: PrismaService,
	) {}

	async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
	}

	async createUser(data: Prisma.UserCreateInput) {
		data.password = await bcrypt.hash(data.password, this.config.crypt.saltRounds);

		return this.prisma.user.create({
			data,
		});
	}
}
