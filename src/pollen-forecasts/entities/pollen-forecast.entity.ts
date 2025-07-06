import { PollenStatus } from "src/shared/enums/PollenStatus";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PollenForecast {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: "float" })
    lat: number;

    @Column({ nullable: false, type: "float" })
    lng: number;

    @Column({ nullable: false, type: 'date' })
    date: Date;

    @Column({ nullable: false, type: 'enum', enum: PollenStatus, default: PollenStatus.LOW })
    tree_pollen: PollenStatus;

    @Column({ nullable: false, type: 'enum', enum: PollenStatus, default: PollenStatus.LOW })
    grass_pollen: PollenStatus;

    @Column({ nullable: false, type: 'enum', enum: PollenStatus, default: PollenStatus.LOW })
    weed_pollen: PollenStatus;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}
