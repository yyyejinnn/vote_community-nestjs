import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
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

  @OneToMany(() => VoteChoicesEntity, (voteChoices) => voteChoices.vote, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  voteChoices: VoteChoicesEntity[];

  // likedUsers Users[]  @relation("LikedVoteUsers")
  // votedUsers   VotedUsers[]
  // VoteComments VoteComments[]
}

@Entity({ name: 'vote-options' })
export class VoteChoicesEntity extends CommonEntity {
  @ManyToOne(() => VotesEntity, (vote) => vote.voteChoices, {
    onDelete: 'CASCADE',
  })
  vote: VotesEntity;

  @Column()
  title: string;

  // votedUsers VotedUsers[]
}
