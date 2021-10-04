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
const express_1 = require("express");
const NotAuthorizedException_1 = __importDefault(require("../exceptions/NotAuthorizedException"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const post_model_1 = __importDefault(require("../post/post.model"));
const user_model_1 = __importDefault(require("./user.model"));
const UserNotFoundException_1 = __importDefault(require("../exceptions/UserNotFoundException"));
class UserController {
    constructor() {
        this.path = '/users';
        this.router = (0, express_1.Router)();
        this.post = post_model_1.default;
        this.user = user_model_1.default;
        this.getUserById = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const id = request.params.id;
            const userQuery = this.user.findById(id);
            if (request.query.withPosts === 'true') {
                userQuery.populate('posts').exec();
            }
            const user = yield userQuery;
            if (user) {
                response.send(user);
            }
            else {
                next(new UserNotFoundException_1.default(id));
            }
        });
        this.getAllPostsOfUser = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
            const userId = request.params.id;
            // @ts-ignore
            const user = request.user._id.toString();
            if (userId === user) {
                const posts = yield this.post.find({ author: userId });
                response.send(posts);
            }
            next(new NotAuthorizedException_1.default());
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}/:id`, auth_middleware_1.default, this.getUserById);
        this.router.get(`${this.path}/:id/posts`, auth_middleware_1.default, this.getAllPostsOfUser);
    }
}
exports.default = UserController;
