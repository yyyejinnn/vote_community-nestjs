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

  @ManyToOne((type) => UsersEntity, (writer) => writer.writtenVotes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'writerId' })
  writer: UsersEntity;

  @Column()
  writerId: number;

  @OneToMany((type) => VoteChoicesEntity, (voteChoices) => voteChoices.vote, {
    nullable: true,
    cascade: ['insert'],
  })
  @JoinTable()
  voteChoices: VoteChoicesEntity[];

  @OneToMany((type) => VotedUsersEntity, (voted) => voted.vote, {})
  voted: VotedUsersEntity[];

  @ManyToMany((type) => UsersEntity, (likedUsers) => likedUsers.likedVotes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'liked_votes' })
  likedUsers: UsersEntity[];

  @OneToMany((type) => CommentsEntity, (comments) => comments.vote, {
    eager: true,
  })
  comments: CommentsEntity[];
}

@Entity({ name: 'vote-options' })
export class VoteChoicesEntity extends CommonEntity {
  @ManyToOne((type) => VotesEntity, (vote) => vote.voteChoices, {
    onDelete: 'CASCADE',
  })
  vote: VotesEntity;

  @Column()
  title: string;

  @OneToMany((type) => ChoicedUsersEntity, (choiced) => choiced.choice, {
    eager: true,
  })
  @JoinTable()
  choiced: ChoicedUsersEntity[];
}

@Entity({ name: 'votes_to_users' })
@Index('voted_user', ['vote', 'user'], { unique: true })
export class VotedUsersEntity extends CommonEntity {
  @ManyToOne((type) => VotesEntity, (vote) => vote.voted, {
    onDelete: 'CASCADE',
  })
  vote: VotesEntity;

  @ManyToOne((type) => UsersEntity, (user) => user.votedUsers, {
    onDelete: 'SET NULL',
  })
  user: UsersEntity;
}

@Entity({ name: 'choices_to_users' })
@Index('choiced_user', ['choice', 'user'], { unique: true })
export class ChoicedUsersEntity extends CommonEntity {
  @ManyToOne((type) => VoteChoicesEntity, (choice) => choice.choiced, {
    onDelete: 'CASCADE',
  })
  choice: VoteChoicesEntity;

  @ManyToOne((type) => UsersEntity, (user) => user.choicedUsers, {
    onDelete: 'SET NULL',
  })
  user: UsersEntity;
}
