"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/controllers/user/CreateUserController.ts
var CreateUserController_exports = {};
__export(CreateUserController_exports, {
  CreateUserController: () => CreateUserController
});
module.exports = __toCommonJS(CreateUserController_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateUserController
});
