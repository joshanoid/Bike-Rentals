declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_TOKEN_SECRET: string
            NODE_ENV: 'development' | 'production'
        }
    }
}

export {}
