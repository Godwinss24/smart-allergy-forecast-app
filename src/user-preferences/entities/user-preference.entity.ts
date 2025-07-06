import { AllergenType } from "src/shared/enums/AllergenType";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPreference {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.preferences)
    @JoinColumn()
    user: User;

    @Column()
    userId: string;

    @Column({ nullable: false, type: "float" })
    lat: number;

    @Column({ nullable: false, type: "float" })
    lng: number;

    @Column({ nullable: false, type: 'enum', enum: AllergenType, array: true })
    sensitiveTo: AllergenType[];

    @Column({ nullable: false, type: 'time' })
    timeToAlert: string;
}
