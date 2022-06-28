import mongoose from "mongoose";

export const AuthRegisterUserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    id: String,
    name: String,
    phoneNumber: String,
    cpf: String,
}, { timestamps: true, collection: 'users' });


