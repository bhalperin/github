import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { globalConfig } from '../../config/config';
import { PrismaService } from '../../prisma/prisma.service';

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

	async getUsers() {
		return await this.prisma.user.findMany();
	}

	async getUserById(id: number) {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
		}

		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) {
			throw new HttpException(`User with email ${email} not found`, HttpStatus.NOT_FOUND);
		}

		return user;
	}

	async createUser(data: Prisma.UserCreateInput) {
		const { email, password } = data;
		const user = await this.prisma.user.findUnique({ where: { email } });

		if (user) {
			throw new HttpException(`User with email ${email} already exists`, HttpStatus.BAD_REQUEST);
		}

		data.password = await bcrypt.hash(password, this.config.crypt.saltRounds);

		return this.prisma.user.create({ data });
	}

	async updateUser(id: number, data: Prisma.UserUpdateInput) {
		const user = await this.prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
		}

		return this.prisma.user.update({ where: { id }, data });
	}

	async deleteUserById(id: number) {
		await this.getUserById(id);

		return await this.prisma.user.delete({ where: { id } });
	}
}
