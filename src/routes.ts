import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";

const router = Router()

router.get("/teste", (request: Request, response: Response) => {
    return response.json({ ok: true })
})


router.post("/user", new CreateUserController().handle)
router.post("/session", new AuthUserController().handle)

export { router }