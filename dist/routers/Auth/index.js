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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const passport_1 = __importDefault(require("passport"));
const usermodel_1 = require("../../database/models/usermodel");
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    usermodel_1.Usermodel.findById(id, (err, user) => {
        done(err, user);
    });
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var user = req.body;
    user['userid'] = (yield usermodel_1.Usermodel.collection.count({})) + 1;
    usermodel_1.Usermodel.create(user, (err, user) => {
        if (err) {
            res.status(400).json({
                status: false,
                message: 'Not auth',
                error: err,
            });
        }
        else {
            user['password'] = undefined;
            res.status(200).json({
                status: true,
                message: 'auth',
                user: user,
            });
        }
    });
}));
router.post('/login', (req, res) => {
    passport_1.default.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(403).json({
                status: false,
                message: 'Not auth',
                error: err.message,
            });
        }
        else {
            req.logIn(user, (err) => {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        status: false,
                        message: 'Not auth',
                        error: err.stack,
                    });
                }
                else {
                    res.status(200).json({
                        status: true,
                        message: `You have been logged in Successfully with ${user.username}`,
                        user: user,
                    });
                }
            });
        }
    })(req, res);
});
router.delete('/', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).json({
            status: true,
            message: 'You have been logged out Successfully',
        });
    });
});
module.exports = router;
