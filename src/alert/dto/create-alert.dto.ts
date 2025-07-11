import { PollenType } from "src/shared/enums/PollenStatus";

export class CreateAlertDto {
    message: string;
    
    risk_level: PollenType
}
