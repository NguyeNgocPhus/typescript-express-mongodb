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
const UserWithThatEmailAlreadyExistsException_1 = __importDefault(require("../../exceptions/UserWithThatEmailAlreadyExistsException"));
const authentication_service_1 = __importDefault(require("../authentication.service"));
describe('The AuthenticationService', () => {
    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData = {
                token: '',
                expiresIn: 1,
            };
            const authenticationService = new authentication_service_1.default();
            expect(typeof authenticationService.createCookie(tokenData))
                .toEqual('string');
        });
    });
    describe('when registering a user', () => {
        describe('if the email is already taken', () => {
            it('should throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
                const userData = {
                    name: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                };
                const authenticationService = new authentication_service_1.default();
                authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(userData));
                yield expect(authenticationService.register(userData))
                    .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException_1.default(userData.email));
            }));
        });
        describe('if the email is not taken', () => {
            it('should not throw an error', () => __awaiter(void 0, void 0, void 0, function* () {
                const userData = {
                    name: 'John Smith',
                    email: 'john@smith.com',
                    password: 'strongPassword123',
                };
                process.env.JWT_SECRET = 'jwt_secret';
                const authenticationService = new authentication_service_1.default();
                authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
                authenticationService.user.create = jest.fn().mockReturnValue(Object.assign(Object.assign({}, userData), { _id: 0 }));
                yield expect(authenticationService.register(userData))
                    .resolves.toBeDefined();
            }));
        });
    });
});
