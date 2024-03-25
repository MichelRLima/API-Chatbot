import prismaClient from "../../prisma";
import { hash } from "bcryptjs"
import { UserRequest } from "../../models/interfaces/user/UserRequest";

class CreateUserService {
    async execute({ name, username, password }: UserRequest) {

        if (!username) {
            throw new Error("Username invalido")
        }

        const userAlreadyExist = await prismaClient.user.findFirst({
            where: {
                username: username
            }
        })

        if (userAlreadyExist) {
            throw new Error("Username ja existe")
        }

        const passwordHash = await hash(password, 8);
        const user = prismaClient.user.create({
            data: {
                name: name,
                username: username,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                username: true
            }
        })

        return user
    }
}

export { CreateUserService }