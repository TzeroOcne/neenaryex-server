import cookie from '@fastify/cookie';
import swagger from '@fastify/swagger';
import fastify from 'fastify';
import Surreal from 'surrealdb.js';
const db = new Surreal('http://localhost:8000/rpc', {
    auth: {
        user: 'root',
        pass: 'root',
    },
    ns: 'nnry',
    db: 'nnry',
});
const server = fastify();
server.register(cookie, {
    secret: 'my-secret',
    hook: 'onRequest',
    parseOptions: {
        httpOnly: true,
    },
});
await server.register(swagger, {
    swagger: {
        info: {
            title: 'Neenaryex API',
            description: 'Fastify API for Neenaryex',
            version: '0.1.0',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'Auth', description: 'Auth related endpoint' },
        ],
        definitions: {
            AuthRequest: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                },
            },
        },
    },
});
server.post('/ping', {
    schema: {
        tags: ['Auth'],
        body: {
            type: 'object',
            properties: {
                username: { type: 'string' },
                password: { type: 'string' },
            },
        },
        response: {
            201: {
                description: 'Sucess',
                type: 'object',
                properties: {},
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
        another: '',
    };
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
