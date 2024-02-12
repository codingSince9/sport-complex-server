import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { SportsClassDto } from './dto/sports-class.dto';
import { AppModule } from '../app.module';
import { DatabaseService } from '../database/database.service';
import { Connection } from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AlreadyAppliedException } from '../exceptions/already-applied.exception';

describe('SportsClassController', () => {
  let dbConnection: Connection;
  let httpServer: any;
  let app: any;
  let adminUserToken: string;
  let regularUserToken: string;

  const sportsClassMock = {
    description: 'test class',
    duration: 150,
    weekSchedule: ['monday', 'thursday', 'friday'],
    startDate: '03/12/2024',
    endDate: '05/15/2026',
    applicationDeadline: '04/11/2024',
    startTime: '12:12',
    sport: 'football',
  };

  const sportsClassDeadlineReachedMock = {
    description: 'test deadline class',
    duration: 150,
    weekSchedule: ['monday', 'thursday', 'friday'],
    startDate: '02/12/2024',
    endDate: '05/15/2026',
    applicationDeadline: '02/12/2024',
    startTime: '12:12',
    sport: 'football',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbHandle();
    httpServer = app.getHttpServer();

    await request(httpServer).post('/auth/register').send({
      email: 'jest@victorious.com',
      password: 'password',
      confirmPassword: 'password',
    });
    const adminLoginResponse = await request(httpServer)
      .get('/auth/login')
      .send({
        email: 'jest@victorious.com',
        password: 'password',
      });
    adminUserToken = adminLoginResponse.body.token;

    await request(httpServer).post('/auth/register').send({
      email: 'jest@gmail.com',
      password: 'password',
      confirmPassword: 'password',
    });
    const userLoginResponse = await request(httpServer)
      .get('/auth/login')
      .send({
        email: 'jest@gmail.com',
        password: 'password',
      });
    regularUserToken = userLoginResponse.body.token;
  });

  afterAll(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('sports').deleteMany({});
    await dbConnection.collection('sportsclasses').deleteMany({});
    await app.close();
  });

  beforeEach(async () => {});

  describe('getSportsClasses', () => {
    it('should return an array of sports classes', async () => {
      await dbConnection
        .collection('sportsclasses')
        .insertOne(sportsClassMock, {
          forceServerObjectId: true,
        });
      const response = await request(httpServer).get('/classes/all');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([sportsClassMock]);
    });
  });

  describe('createSportsClass', () => {
    it('should create a new sports class', async () => {
      const sport = { name: 'football' };
      await request(app.getHttpServer())
        .post('/sport/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(sport)
        .expect(201);
      const response = await request(app.getHttpServer())
        .post('/classes/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(sportsClassMock)
        .expect(201);
      const createdSportsClass = response.body;
      expect(createdSportsClass).toMatchObject(sportsClassMock);
    });

    it('should throw unauthorized response code', async () => {
      await request(app.getHttpServer())
        .post('/classes/new')
        .auth(regularUserToken, { type: 'bearer' })
        .send(sportsClassMock)
        .expect(403);
    });

    it('should throw a bad request code', async () => {
      const { description, ...invalidSportsClass } = sportsClassMock;
      await request(app.getHttpServer())
        .post('/classes/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(invalidSportsClass)
        .expect(400);
    });

    it('should throw a bad request code for sport that does not exist', async () => {
      let invalidSportsClass = Object.assign({}, sportsClassMock);
      invalidSportsClass.sport = 'basketball';
      await request(app.getHttpServer())
        .post('/classes/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(invalidSportsClass)
        .expect(400);
    });
  });

  describe('applyToSportsClass', () => {
    let regularClassResponse: any;
    let deadlineClassResponse: any;
    beforeAll(async () => {
      regularClassResponse = await request(app.getHttpServer())
        .post('/classes/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(sportsClassMock);
      deadlineClassResponse = await request(app.getHttpServer())
        .post('/classes/new')
        .auth(adminUserToken, { type: 'bearer' })
        .send(sportsClassDeadlineReachedMock);
      expect(regularClassResponse.status).toBe(201);
      expect(deadlineClassResponse.status).toBe(201);
    });

    it('should apply to sports class', async () => {
      await request(app.getHttpServer())
        .put(`/classes/apply/${regularClassResponse.body._id}`)
        .auth(regularUserToken, { type: 'bearer' })
        .expect(200);
    });

    it('should throw DeadlineReachedException exception', async () => {
      const response = await request(app.getHttpServer())
        .put(`/classes/apply/${deadlineClassResponse.body._id}`)
        .auth(regularUserToken, { type: 'bearer' });
      expect(response.body.status).toBe(403);
      expect(response.body.name).toBe('DeadlineReachedException');
    });

    it('should throw AlreadyAppliedException', async () => {
      await request(app.getHttpServer())
        .put(`/classes/apply/${regularClassResponse.body._id}`)
        .auth(regularUserToken, { type: 'bearer' })
        .expect(200);
      const response = await request(app.getHttpServer())
        .put(`/classes/apply/${regularClassResponse.body._id}`)
        .auth(regularUserToken, { type: 'bearer' });
      expect(response.body.status).toBe(409);
      expect(response.body.name).toBe('AlreadyAppliedException');
    });

    it('should throw ClassDoesNotExist exception', async () => {
      const response = await request(app.getHttpServer())
        .put('/classes/apply/123456789123456789123456')
        .auth(regularUserToken, { type: 'bearer' });
      expect(response.body.status).toBe(404);
      expect(response.body.name).toBe('ClassDoesNotExistException');
    });
  });
});
