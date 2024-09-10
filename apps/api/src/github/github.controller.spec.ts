import { Test, TestingModule } from '@nestjs/testing';

import { GithubController } from './github.controller';
import { GithubService } from './github.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [GithubController],
      providers: [GithubService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<GithubController>(GithubController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
