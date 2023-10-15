"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermodel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    userid: { type: String, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
exports.Usermodel = mongoose_1.default.model('User', UserSchema);
