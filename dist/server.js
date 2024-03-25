"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/server.ts
var import_express2 = __toESM(require("express"));

// src/routes.ts
var import_express = require("express");

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/user/CreateUserService.ts
var import_bcryptjs = require("bcryptjs");
var CreateUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ name, username, password }) {
      if (!username) {
        throw new Error("Username invalido");
      }
      const userAlreadyExist = yield prisma_default.user.findFirst({
        where: {
          username
        }
      });
      if (userAlreadyExist) {
        throw new Error("Username ja existe");
      }
      const passwordHash = yield (0, import_bcryptjs.hash)(password, 8);
      const user = prisma_default.user.create({
        data: {
          name,
          username,
          password: passwordHash
        },
        select: {
          id: true,
          name: true,
          username: true
        }
      });
      return user;
    });
  }
};

// src/controllers/user/CreateUserController.ts
var CreateUserController = class {
  handle(request, response) {
    return __async(this, null, function* () {
      const { name, username, password } = request.body;
      const createUserService = new CreateUserService();
      const user = yield createUserService.execute({ name, username, password });
      return response.json(user);
    });
  }
};

// src/services/user/AuthUserService..ts
var import_bcryptjs2 = require("bcryptjs");
var import_jsonwebtoken = require("jsonwebtoken");
var AuthUserService = class {
  execute(_0) {
    return __async(this, arguments, function* ({ username, password }) {
      if (!username) {
        throw new Error("Username precisa ser informado");
      }
      if (!password) {
        throw new Error("Senha precisa ser informado");
      }
      const user = yield prisma_default.user.findFirst({
        where: {
          username
        }
      });
      if (!user) {
        throw new Error("Username n\xE3o encontrado");
      }
      const passwordMath = yield (0, import_bcryptjs2.compare)(password, user == null ? void 0 : user.password);
      if (!passwordMath) {
        throw new Error("Senha incorreta");
      }
      const token = (0, import_jsonwebtoken.sign)(
        {
          name: user == null ? void 0 : user.name,
          username: user == null ? void 0 : user.username
        },
        process.env.JWT_SECRET,
        {
          subject: user == null ? void 0 : user.id,
          expiresIn: "30d"
        }
      );
      return {
        id: user == null ? void 0 : user.id,
        name: user == null ? void 0 : user.name,
        username: user == null ? void 0 : user.username,
        token
      };
    });
  }
};

// src/controllers/user/AuthUserController.ts
var AuthUserController = class {
  handle(request, response) {
    return __async(this, null, function* () {
      const { username, password } = request.body;
      const authUserService = new AuthUserService();
      const auth = yield authUserService.execute({
        username,
        password
      });
      return response.json(auth);
    });
  }
};

// src/routes.ts
var router = (0, import_express.Router)();
router.get("/teste", (request, response) => {
  return response.json({ ok: true });
});
router.post("/user", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);

// src/server.ts
var import_express_async_errors = require("express-async-errors");
var import_cors = __toESM(require("cors"));
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));

// swagger.json
var swagger_default = {
  openapi: "3.0.0",
  info: {
    title: "API para chatbot",
    description: "API para desenvolvimento de chat para abertura de chamado",
    termOfService: "http://localhost:3333/terms",
    contact: {
      "email:": "michelrocha502@gmail.com"
    },
    version: "1.0.0"
  },
  paths: {
    "/user": {
      post: {
        description: "Criar o usuario",
        requestBody: {
          description: "Dados necess\xE1rios para cria\xE7\xE3o do usu\xE1rio",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestCreateUser"
              }
            }
          }
        },
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseCreateUser"
                }
              }
            }
          }
        }
      }
    },
    "/session": {
      post: {
        description: "Logar e autenticar usu\xE1rio",
        requestBody: {
          description: "Dados necess\xE1rios para o login e autentica\xE7\xE3o de um usu\xE1rio",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestAuthUser"
              }
            }
          }
        },
        responses: {
          "200": {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseAuthUser"
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      RequestCreateUser: {
        type: "object",
        properties: {
          name: {
            type: "string"
          },
          username: {
            type: "string"
          },
          password: {
            type: "string"
          }
        }
      },
      ResponseCreateUser: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          username: {
            type: "string"
          }
        }
      },
      RequestAuthUser: {
        type: "object",
        properties: {
          username: {
            type: "string"
          },
          password: {
            type: "string"
          }
        }
      },
      ResponseAuthUser: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          username: {
            type: "string"
          },
          token: {
            type: "string"
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        description: "Autentifica\xE7\xE3o utilizando JWT",
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};

// src/server.ts
var app = (0, import_express2.default)();
var port = 3333;
app.use(import_express2.default.json());
app.use(router);
app.use((0, import_cors.default)());
app.use("/api-docs", import_swagger_ui_express.default.serve, import_swagger_ui_express.default.setup(swagger_default));
app.use((err, request, response, next) => {
  if (err instanceof Error) {
    return response.status(400).json({
      error: err.message
    });
  }
  return response.status(500).json({
    status: "Error",
    menssage: "Internal server error."
  });
});
app.get("/terms", (request, response) => {
  return response.json({
    message: "Termos de servi\xE7o"
  });
});
app.listen(port, () => {
  console.log("API RODANDO ");
});
