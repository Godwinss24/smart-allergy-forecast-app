import { Exclude } from "class-transformer";
import { UserRole } from "../../shared/enums/UserRole";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    email: string;

    @Exclude()
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: false, enum: UserRole, default: UserRole.USER })
    role: UserRole

    @Column({ nullable: true })
    lastName: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}
