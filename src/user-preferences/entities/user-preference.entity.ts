import { AllergenType } from "src/shared/enums/AllergenType";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPreference {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: "float" })
    lat: string;

    @Column({ nullable: false, type: "float" })
    lng: string;

    @Column({ nullable: false, type: 'enum', enum: AllergenType })
    sensitiveTo: AllergenType;

    @Column({ nullable: false, type: 'timestamp' })
    timeToAlert: Date;
}
