import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import "express-async-errors"
import cors from "cors"
import swaggerUI from "swagger-ui-express"
import swaggerDocument from "../swagger.json"
const app = express()
const port = 3333

app.use(express.json())
app.use(router)
app.use(cors())
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return response.status(400).json({
            error: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        menssage: "Internal server error."
    })
})

app.get("/terms", (request: Request, response: Response) => {
    return response.json({
        message: "Termos de serviço"
    })
})

app.listen(port, () => {
    console.log("API RODANDO ")
})