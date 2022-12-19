import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CustomValidationPipe } from 'src/middleware/pipe/validation.pipe';
import * as request from 'supertest';
import { MyLogger } from 'src/app/logger/logger.service';
import { CreateVoteDto, CreateVotedUserDto, UpdateVoteDto } from '@vote/common';
import { VotesService } from 'src/app/votes/votes.service';

describe('votes', () => {
  let app: INestApplication;
  let votesService: VotesService;
  let voteId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    votesService = moduleRef.get<VotesService>(VotesService);

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    app.useLogger(app.get(MyLogger));

    await app.init();
  });

  describe('/votes', () => {
    it('POST', async () => {
      const body: CreateVoteDto = {
        title: '좋아하는 색깔?',
        endDate: new Date('2022-12-30T08:32:17.875Z'),
        voteChoices: ['사과', '딸기', '포도'],
      };
      return await request(app.getHttpServer())
        .post('/votes')
        .send(body)
        .expect(201)
        .then((vote) => {
          console.log(vote.body);
          voteId = vote.body.result.votes.id;
        });
    });
    it('GET', () => {
      return request(app.getHttpServer()).get('/votes').expect(200);
    });
  });

  describe('/votes/:voteId', () => {
    it('GET', () => {
      return request(app.getHttpServer()).get(`/votes/${voteId}`).expect(200);
    });
    it('PATCH', async () => {
      const body: UpdateVoteDto = {
        endDate: '2022-12-31T08:32:17.875Z',
      };
      return await request(app.getHttpServer())
        .patch(`/votes/${voteId}`)
        .send(body)
        .expect(200);
    });
    it('/choice/vote POST', async () => {
      const choicedVote = await votesService.getVoteById(voteId);
      const choicedVoteId = choicedVote.voteChoices[0].id;
      const body: CreateVotedUserDto = {
        choicedVoteId,
      };
      return request(app.getHttpServer())
        .post(`/votes/${voteId}/choice/vote`)
        .send(body)
        .expect(201);
    });
    it('/like POST', async () => {
      return await request(app.getHttpServer())
        .post(`/votes/${voteId}/like`)
        .expect(201);
    });
    it('/cancle/likes POST', async () => {
      return await request(app.getHttpServer())
        .post(`/votes/${voteId}/cancle/likes`)
        .expect(201);
    });
  });

  afterAll(async () => {
    await votesService.deleteVote(voteId);
    await app.close();
  });
});
