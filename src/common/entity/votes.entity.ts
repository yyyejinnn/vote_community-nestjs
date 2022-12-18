import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommonEntity } from './base.entity';
import { CommentsEntity } from './comments.entity';
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
    nullable: true,
  })
  @JoinTable()
  voteChoices: VoteChoicesEntity[];

  @OneToMany(() => VotedUsersEntity, (voted) => voted.vote)
  voted: VotedUsersEntity[];

  @ManyToMany(() => UsersEntity, (likedUsers) => likedUsers.likedVotes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'liked_votes' })
  likedUsers: UsersEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.vote, {
    eager: true,
  })
  comments: CommentsEntity[];
}

@Entity({ name: 'vote-options' })
export class VoteChoicesEntity extends CommonEntity {
  @ManyToOne(() => VotesEntity, (vote) => vote.voteChoices, {
    onDelete: 'CASCADE',
  })
  vote: VotesEntity;

  @Column()
  title: string;

  @OneToMany(() => ChoicedUsersEntity, (choiced) => choiced.choice, {
    eager: true,
  })
  @JoinTable()
  choiced: ChoicedUsersEntity[];
}

@Entity({ name: 'votes_to_users' })
@Index('voted_user', ['vote', 'user'], { unique: true })
export class VotedUsersEntity extends CommonEntity {
  @ManyToOne(() => VotesEntity, (vote) => vote.voted)
  vote: VotesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.votedUsers, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;
}

@Entity({ name: 'choices_to_users' })
@Index('choiced_user', ['choice', 'user'], { unique: true })
export class ChoicedUsersEntity extends CommonEntity {
  @ManyToOne(() => VoteChoicesEntity, (choice) => choice.choiced)
  choice: VoteChoicesEntity;

  @ManyToOne(() => UsersEntity, (user) => user.choicedUsers, {
    onDelete: 'CASCADE',
  })
  user: UsersEntity;
}
