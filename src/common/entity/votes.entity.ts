import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from './base.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'votes' })
export class VotesEntity extends CommonEntity {
  @Column()
  title: string;

  @CreateDateColumn()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => UsersEntity, (writer) => writer.writtenVotes)
  @JoinColumn({ name: 'writerId' })
  writer: UsersEntity;

  @Column()
  writerId: number;

  @OneToMany(() => VoteChoicesEntity, (voteChoices) => voteChoices.vote)
  voteChoices: VoteChoicesEntity[];

  // id         Int      @id @default(autoincrement())
  // likedUsers Users[]  @relation("LikedVoteUsers")
  // voteChoices  VoteChoices[]
  // votedUsers   VotedUsers[]
  // VoteComments VoteComments[]
}

@Entity({ name: 'vote-options' })
export class VoteChoicesEntity extends CommonEntity {
  @ManyToOne(() => VotesEntity, (vote) => vote.voteChoices)
  vote: VotesEntity;

  // title     String
  // votedUsers VotedUsers[]
}
