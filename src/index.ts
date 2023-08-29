import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import { AuthRequest, Response } from '@types';
import fastify from 'fastify';
import { writeFile } from 'fs/promises';
import Surreal from 'surrealdb.js';

const db = new Surreal('http://localhost:8000/rpc', {
  auth: {
    user: 'root',
    pass: 'root',
  },
  ns: 'nnry',
  db: 'nnry',
})

const server = fastify();

server.register(cookie, {
  secret: 'my-secret',
  hook: 'onRequest',
  parseOptions: {
    httpOnly: true,
  },
});

await server.register(swagger, {
  openapi: {
    info: {
      title: 'Neenaryex API',
      description: 'Fastify API for Neenaryex',
      version: '0.1.0',
    },
    tags: [
      { name: 'Auth', description: 'Auth related endpoint' },
    ],
  },
  refResolver: {
    buildLocalReference(json, baseUri, fragment, i) {
      return `${json.$id}`;
    },
  },
})

server.addSchema({
  $id: 'AuthRequest',
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
})

server.post<{ Body: AuthRequest, Response: Response }>('/ping', {
  schema: {
    tags: [ 'Auth' ],
    body: {
      $ref: 'AuthRequest#'
    },
    response: {
      201: {
        description: 'Sucess',
        type: 'object',
      },
    },
  },
}, async (request, reply) => {
  console.log(await fetch('https://api.mangadex.org/auth/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(request.body),
  }));
  
  return {
    result: 'Ok',
  };
})

await server.ready();
await writeFile('openapi.yaml', server.swagger({ yaml: true }));

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
  
})
