import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './base.entity';

@Entity({ name: 'users' })
export class UsersEntity extends CommonEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  nickname: string;
}
