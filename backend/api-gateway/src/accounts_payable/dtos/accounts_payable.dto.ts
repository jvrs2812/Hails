import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { PayamentsDto } from "../../payaments/dto/payaments.dto";

export class AccountsPayableDto {
    _id: string;

    id_user: string;

    @IsString()
    @IsNotEmpty()
    favored: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    number_installments: number;

    @IsNumber()
    @IsNotEmpty()
    value_total: number;

    @IsNumber()
    @IsNotEmpty()
    value_total_payament: number;

    @Type(() => PayamentsDto)
    @ValidateNested({ each: true })
    installments: PayamentsDto[];
}