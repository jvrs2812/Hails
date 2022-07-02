import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PayamentsDto {

    @IsString()
    @IsNotEmpty({ message: "Tipo de pagamento da parcela não informado" })
    typePayaments: string;


    @IsNotEmpty({ message: "Data de vencimento da parcela não informado" })
    due_date: Date;

    @IsNumber()
    @IsNotEmpty({ message: "Valor da parcela não informado" })
    value: number;

    @IsNumber()
    @IsNotEmpty({ message: "Desconto da parcela não informado" })
    discount: number;

    @IsNumber()
    @IsNotEmpty({ message: "Juros da parcela não informado" })
    fees: number;

    payament_date: Date;

    value_payament: number;

    obs: string;
}