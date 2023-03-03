import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from './base.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokensEntity extends CommonEntity {
  @Column({ unique: true, nullable: true })
  token: string;

  @OneToOne(() => UsersEntity, (user) => user.refreshToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;

  @Column()
  userId: number;
}
