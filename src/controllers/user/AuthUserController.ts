import { Request, Response } from "express";
import { AuthRequest } from "../../models/interfaces/user/auth/AuthRequest";
import { AuthUserService } from "../../services/user/AuthUserService.";

class AuthUserController {

    async handle(request: Request, response: Response) {
        const { username, password }: AuthRequest = request.body

        const authUserService = new AuthUserService()

        const auth = await authUserService.execute({
            username: username,
            password: password
        })

        return response.json(auth)
    }
}

export { AuthUserController }