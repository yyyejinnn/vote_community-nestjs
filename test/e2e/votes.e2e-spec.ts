import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CustomValidationPipe } from 'src/middleware/pipe/validation.pipe';
import * as request from 'supertest';
import { MyLogger } from 'src/app/logger/logger.service';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
} from '@vote/common';
import { VotesService } from 'src/app/votes/votes.service';

describe('votes', () => {
  let app: INestApplication;
  let votesService: VotesService;
  let voteId: number;
  let commentId: number;

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

  describe('/votes/:voteId/comments', () => {
    it('GET', () => {
      return request(app.getHttpServer())
        .get(`/votes/${voteId}/comments`)
        .expect(200);
    });
    it('POST', async () => {
      const body: CreateVoteCommentDto = {
        content: '댓글 test',
      };
      return await request(app.getHttpServer())
        .post(`/votes/${voteId}/comments`)
        .send(body)
        .expect(201)
        .then((comment) => {
          console.log(comment.body);
          commentId = comment.body.result.comments.id;
        });
    });
    it('/:commentId PATCH', () => {
      const body: UpdateVoteCommentDto = {
        content: '변경된 댓글 test',
      };
      return request(app.getHttpServer())
        .patch(`/votes/${voteId}/comments/${commentId}`)
        .send(body)
        .expect(200);
    });
    it('/:commentId/like POST', async () => {
      return await request(app.getHttpServer())
        .post(`/votes/${voteId}/comments/${commentId}/like`)
        .expect(201);
    });
    it(':commentId/cancle/likes POST', async () => {
      return await request(app.getHttpServer())
        .post(`/votes/${voteId}/comments/${commentId}/cancle/likes`)
        .expect(201);
    });
  });

  describe('Delete vote and comments', () => {
    it('comment DELETE', () => {
      return request(app.getHttpServer())
        .delete(`/votes/${voteId}/comments/${commentId}`)
        .expect(200);
    });
    it('vote DELETE', () => {
      return request(app.getHttpServer())
        .delete(`/votes/${voteId}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
