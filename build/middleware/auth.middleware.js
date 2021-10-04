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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthenticationTokenMissingException_1 = __importDefault(require("../exceptions/AuthenticationTokenMissingException"));
const WrongAuthenticationTokenException_1 = __importDefault(require("../exceptions/WrongAuthenticationTokenException"));
const user_model_1 = __importDefault(require("../user/user.model"));
function authMiddleware(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = request.cookies;
        console.log(cookies);
        if (cookies && cookies.JWT) {
            const secret = process.env.JWT_SECRET || "";
            try {
                const verificationResponse = jsonwebtoken_1.default.verify(cookies.JWT, secret);
                const id = verificationResponse._id;
                const user = yield user_model_1.default.findById(id);
                if (user) {
                    // @ts-ignore
                    request.user = user;
                    next();
                }
                else {
                    next(new WrongAuthenticationTokenException_1.default());
                }
            }
            catch (error) {
                next(new WrongAuthenticationTokenException_1.default());
            }
        }
        else {
            console.log("loi");
            next(new AuthenticationTokenMissingException_1.default());
        }
    });
}
exports.default = authMiddleware;
