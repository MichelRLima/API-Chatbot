import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";
import { AuthRequest } from "../../models/interfaces/user/auth/AuthRequest";

class AuthUserService {
    async execute({ username, password }: AuthRequest) {

        if (!username) {
            throw new Error("Username precisa ser informado")
        }

        if (!password) {
            throw new Error("Senha precisa ser informado")
        }

        const user = await prismaClient.user.findFirst({
            where: {
                username: username
            }
        })

        if (!user) {
            throw new Error("Username não encontrado")
        }

        const passwordMath = await compare(password, user?.password)

        if (!passwordMath) {
            throw new Error("Senha incorreta")
        }

        const token = sign(
            {
                name: user?.name,
                username: user?.username
            },
            process.env.JWT_SECRET as string,
            {
                subject: user?.id,
                expiresIn: "30d"
            }
        )

        return {
            id: user?.id,
            name: user?.name,
            username: user?.username,
            token: token
        }
    }
}

export { AuthUserService }