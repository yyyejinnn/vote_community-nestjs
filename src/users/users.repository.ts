import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UsersRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUser() {
    return this.prisma.user.findUnique({
      where: {
        id: 1, // 임시
      },
    });
  }
}
