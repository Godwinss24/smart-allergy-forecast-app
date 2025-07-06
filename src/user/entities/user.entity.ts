import { Exclude } from "class-transformer";
import { UserRole } from "../../shared/enums/UserRole";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserPreference } from "src/user-preferences/entities/user-preference.entity";

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
    role: UserRole;

    @Column({ nullable: true })
    lastName: string;

    @OneToOne(() => UserPreference, (user_preference) => user_preference.user, { onDelete: "CASCADE"})
    preferences: UserPreference;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

}
