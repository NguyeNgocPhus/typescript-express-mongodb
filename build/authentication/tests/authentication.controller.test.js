"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const request = __importStar(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const authentication_controller_1 = __importDefault(require("../authentication.controller"));
describe('The AuthenticationController', () => {
    describe('POST /auth/register', () => {
        describe('if the email is not taken', () => {
            it('response should have the Set-Cookie header with the Authorization token', () => {
                const userData = {
                    name: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                };
                process.env.JWT_SECRET = 'jwt_secret';
                const authenticationController = new authentication_controller_1.default();
                authenticationController.authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
                authenticationController.authenticationService.user.create = jest.fn().mockReturnValue(Object.assign(Object.assign({}, userData), { _id: 0 }));
                mongoose.connect = jest.fn();
                const app = new app_1.default([
                    authenticationController,
                ]);
                return request(app.getServer())
                    .post(`${authenticationController.path}/register`)
                    .send(userData)
                    .expect('Set-Cookie', /^Authorization=.+/);
            });
        });
    });
});
