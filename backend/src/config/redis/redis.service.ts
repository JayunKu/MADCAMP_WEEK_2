import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis.RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = Redis.createClient({
      url: this.configService.get('redis.url'),
    });

    this.client.on('connect', () => {
      console.info('=> Redis Service connected');
    });

    this.client.on('error', (err) => {
      console.error('=> Redis Service Error', err);
    });

    this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await this.client.expire(key, ttl);
    return result === 1;
  }

  async hSet(key: string, field: string, value: string): Promise<number> {
    return await this.client.hSet(key, field, value);
  }

  async hGet(key: string, field: string): Promise<string | null> {
    return await this.client.hGet(key, field);
  }

  async hDel(key: string, ...fields: string[]): Promise<number> {
    return await this.client.hDel(key, fields);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.client.hGetAll(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  // List 관련 함수들
  async lPush(key: string, ...values: string[]): Promise<number> {
    return await this.client.lPush(key, values);
  }

  async rPush(key: string, ...values: string[]): Promise<number> {
    return await this.client.rPush(key, values);
  }

  async lPop(key: string): Promise<string | null> {
    return await this.client.lPop(key);
  }

  async rPop(key: string): Promise<string | null> {
    return await this.client.rPop(key);
  }

  async lLen(key: string): Promise<number> {
    return await this.client.lLen(key);
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.lRange(key, start, stop);
  }

  async lIndex(key: string, index: number): Promise<string | null> {
    return await this.client.lIndex(key, index);
  }

  async lSet(key: string, index: number, value: string): Promise<string> {
    return await this.client.lSet(key, index, value);
  }

  async lRem(key: string, count: number, value: string): Promise<number> {
    return await this.client.lRem(key, count, value);
  }

  async lTrim(key: string, start: number, stop: number): Promise<string> {
    return await this.client.lTrim(key, start, stop);
  }

  getClient(): Redis.RedisClientType {
    return this.client;
  }
}
