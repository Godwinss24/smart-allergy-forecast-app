import { PollenType } from "src/shared/enums/PollenStatus";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Alert {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;
    
    @ManyToOne(() => User, (user) => user.alerts)
    @JoinColumn()
    user: User;


    @Column({ nullable: false })
    message: string;

    @Column({ nullable: false })
    risk_level: PollenType;

    @Column({ default: false })
    isRead: boolean;  

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
