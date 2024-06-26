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
    eager: true,
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

  @ManyToMany((type) => TagsEntity, (tags) => tags.votes, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  tags: TagsEntity[];
}

@Entity({ name: 'tags' })
export class TagsEntity extends CommonEntity {
  @Column({
    unique: true,
  })
  name: string;

  @ManyToMany((type) => VotesEntity, (votes) => votes.tags)
  @JoinTable()
  votes: VotesEntity[];
}

@Entity({ name: 'vote-options' })
export class VoteChoicesEntity extends CommonEntity {
  @ManyToOne((type) => VotesEntity, (vote) => vote.voteChoices, {
    onDelete: 'CASCADE',
  })
  vote: VotesEntity;

  @Column()
  title: string;

  @ManyToMany(() => UsersEntity)
  @JoinTable()
  choicedUsers: UsersEntity[];
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

// @Entity({ name: 'choices_to_users' })
// @Unique(['choice', 'user'])
// export class ChoicedUsersEntity extends CommonEntity {

//   @ManyToOne((type) => VoteChoicesEntity, (choice) => choice.choicedUsers, {
//     onDelete: 'CASCADE',
//   })
//   @JoinColumn({ name: 'choiceId' })
//   choice: VoteChoicesEntity;

//   @ManyToOne((type) => UsersEntity, (user) => user.choicedOptions, {
//     onDelete: 'CASCADE'
//   })
//   @JoinColumn({ name: 'userId' })
//   user: UsersEntity;
// }