
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from  "typeorm";


@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

}
