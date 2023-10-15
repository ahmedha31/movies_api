"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
function isAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.user);
            if (req.user) {
                next();
            }
            else {
                res.status(401).json({
                    status: false,
                    message: 'Not auth',
                    error: 'Not auth',
                });
            }
        }
        catch (e) {
            res.status(401).json({
                status: false,
                message: 'Not auth',
                error: e,
            });
        }
    });
}
exports.isAuth = isAuth;
