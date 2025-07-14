import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GameService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(prompt: string): Promise<any> {
    const aiServerUrl = 'http://localhost:8001/generate'; // Should be in a config file
    try {
      const response = await firstValueFrom(
        this.httpService.post(aiServerUrl, { prompt }),
      );
      return response.data;
    } catch (error) {
      console.error('Error calling AI Image Server:', error);
      throw new Error('Failed to generate image');
    }
  }
}
