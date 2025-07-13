import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis/redis.service';
import { User } from 'src/config/redis/model';

@Injectable()
export class UserRedisService {
  constructor(private readonly redisService: RedisService) {}

  async createUser(userId: string, roomId?: string): Promise<User> {
    const user: User = {
      id: userId,
      is_member: false,
      room_id: roomId || null,
    };

    const userKey = `users:${userId}`;
    await this.redisService.hSet(userKey, 'id', userId);
    await this.redisService.hSet(userKey, 'is_member', 'false');
    await this.redisService.hSet(userKey, 'room_id', roomId || '');

    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const userKey = `users:${userId}`;
    const userData = await this.redisService.hGetAll(userKey);

    if (!userData || Object.keys(userData).length === 0) {
      return null;
    }

    return {
      id: userData.id,
      is_member: userData.is_member === 'true',
      room_id: userData.room_id || null,
    };
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const userKey = `users:${userId}`;
    const exists = await this.redisService.exists(userKey);
    if (!exists) return null;

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === null) continue;

      switch (key) {
        // boolean
        case 'is_member':
          await this.redisService.hSet(userKey, key, value.toString());
          break;
        // string
        case 'id':
        case 'room_id':
          await this.redisService.hSet(userKey, key, value as string);
          break;
      }
    }

    return await this.getUserById(userId);
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userKey = `users:${userId}`;
    const result = await this.redisService.del(userKey);
    return result > 0;
  }

  async getAllUsers(): Promise<User[]> {
    const userKeys = await this.redisService.keys('users:*');
    const users: User[] = [];

    for (const key of userKeys) {
      const userData = await this.redisService.hGetAll(key);
      if (userData && Object.keys(userData).length > 0) {
        const user: User = {
          id: userData.id,
          is_member: userData.is_member === 'true',
          room_id: userData.room_id || null,
        };
        users.push(user);
      }
    }

    return users;
  }

  async getUsersByRoomId(roomId: string): Promise<User[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter((user) => user.room_id === roomId && user.is_member);
  }
}
