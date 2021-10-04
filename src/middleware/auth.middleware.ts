import express ,{ NextFunction, Response,Request} from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';


async function authMiddleware(request: Request, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  console.log(cookies);
  
  if (cookies && cookies.JWT) {
    const secret = process.env.JWT_SECRET||"";
    try {
      
      const verificationResponse = jwt.verify(cookies.JWT, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        // @ts-ignore
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    console.log("loi")
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
