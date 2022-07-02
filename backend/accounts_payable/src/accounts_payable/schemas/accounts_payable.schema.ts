import mongoose from "mongoose";
import { PayamentsInterface } from "../../payaments/interfaces/payaments.interface";

export const AccountsPayableSchema = new mongoose.Schema({
    id: String,
    id_user: String,
    favored: String,
    number_installments: Number,
    value_total: Number,
    description: String,
    value_total_payament: Number,
    installments: [{
        typePayaments: {
            type: String,
            required: true
        },
        due_date: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        fees: {
            type: Number,
            required: true
        },
        payament_date: {
            default: null,
            type: Date,
            required: false
        },
        obs: {
            default: "",
            type: String,
            required: false
        }
    }],
}, { timestamps: true, collection: 'accounts_payable' });
