import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import { User } from '@prisma/client';
import { userInfo } from "os";

// @Injectable()
// export class AuthService {
// 	constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
// 	async signup(dto: AuthDto) {
// 		//generate the password hash
// 		const hash = await argon.hash(dto.password);
// 		// save the new user in the db
// 		try {
// 			const user = await this.prisma.user.create({
// 				data: {
// 					email: dto.email,
// 					hash,
// 				},
// 			});

// 			// return the save user
// 			return this.signToken(user.id, user.email);
// 		} catch (error) {
// 			error instanceof PrismaClientKnownRequestError
// 			if (error.code === "P2002") {
// 				throw new ForbiddenException('Credential taken',);
// 			}
// 			throw error;
// 		}
// 	}

// 	async signin(dto: AuthDto) {
// 		// find user by email
// 		const user = await this.prisma.user.findUnique({
// 			where: {
// 				email: dto.email,
// 			},
// 		});
// 		// if user does not exist Throw exception
// 		if (!user)
// 			throw new ForbiddenException('Credential incorrect',);
// 		// compare password
// 		const pwMatches = await argon.verify(user.hash, dto.password);
// 		// if password is incorrect Throw exception
// 		if (!pwMatches)
// 			throw new ForbiddenException('Credential incorrect',);
// 		// send back the user
// 		return this.signToken(user.id, user.email);
// 	}

// 	async signToken(userId: number, email: string): Promise<{access_token: string}> {
// 		const payload = {
// 			sub: userId,
// 			email,
// 		}
// 		const secret = this.config.get('JWT_SECRET');
// 		const token = await this.jwt.signAsync(
// 			payload,
// 			{
// 				expiresIn: '15m',
// 				secret: secret,
// 			},
// 		);

// 		return {
// 			access_token: token,
// 		};
// 	}
// }


// @Injectable()
// export class AuthService {
// private readonly apiUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c70bce5bd437912004405b4852405f6058a55e49369bad0fde9c8d448fb512b5&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fmain-page&response_type=code';

// constructor(private prisma: PrismaService) {}

// 	async validateUser(dto: AuthDto): Promise<User | null> {
// 	const { login } = dto;
// 	const user = await this.prisma.user.findUnique({ where: { login } });
// 	if (!user) {
// 	return null;
// 	}

// 		const accessToken = await this.getAccessToken(login);
// 		if (!accessToken) {
// 		return null;
// 		}

// 		await this.prisma.user.update({ where: { id: user.id }, data: { accessToken } });
// 		return user;
// 	}

// 	async getAccessToken(login: string): Promise<string | null> {
// 		try {
// 		const response = await axios.post(`${this.apiUrl}/oauth/token`, {
// 			grant_type: 'password',
// 			client_id: process.env.CLIENT_ID,
// 			client_secret: process.env.CLIENT_SECRET,
// 			username: login,
// 		});
// 		return response.data.access_token;
// 		} catch (error) {
// 		console.error(error);
// 		return null;
// 		}
// 	}

// 	async findUserByToken(token: string): Promise<User | null> {
// 		const user = await this.prisma.user.findUnique({ where: { accessToken: token } });
// 		return user ?? null;
// 	}

// 	async removeToken(user: User): Promise<void> {
// 		await this.prisma.user.update({ where: { id: user.id }, data: { accessToken: null } });
// 	}
// }

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async validateUser(details: AuthDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        checkID: details.id,
      },
    });
    if (user) return { ...user, firstLogin: false };
    const checkUserName = await this.prisma.user.findUnique({
      where: {
        login: details.username,
      },
    });
    let data = {
      checkID: details.id,
      login: details.username,
      fullName: details.displayName,
      firstName: details.firstName,
      lastName: details.lastName,
      email: details.email,
      avatarUrl: details.avatarUrl,
      twoFactorAuthenticationSecret: '',
    };
    if (checkUserName) {
      data = {
        ...data,
        login: details.username + '_',
      };
    }

    const newUser = await this.prisma.user.create({
      data,
    });
    return { ...newUser, firstLogin: true };
  }
}