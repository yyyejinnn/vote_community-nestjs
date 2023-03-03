import {
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { CommonEntity } from './base.entity';
import { UsersEntity } from './users.entity';
import { VotesEntity } from './votes.entity';

@Entity({ name: 'vote-comments' })
export class CommentsEntity extends CommonEntity {
  @Column()
  content: string;

  @ManyToOne(() => UsersEntity, (writer) => writer.writtenComments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'writerId' })
  writer: UsersEntity;

  @Column()
  writerId: number;

  @ManyToOne(() => VotesEntity, (vote) => vote.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'voteId' })
  vote: VotesEntity;

  @Column()
  voteId: number;

  @Column({
    default: false,
  })
  isUpdate: boolean;

  @ManyToMany(() => UsersEntity, (likedUsers) => likedUsers.likedComments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({ name: 'liked_comments' })
  likedUsers: UsersEntity[];

  // 안됨
  //   @AfterUpdate()
  //   updateIsUpdate() {
  //     this.isUpdate = true;
  //   }
}
