export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number,
            DB_NAME: string,
            DB_USER: string,
            DB_PASSWORD: string,
            DB_HOST: string,
            DB_PORT: number,
            SECRET_KEY: string,

            SERVER_URL: string
            CLIENT_URL: string,

            SMTP_HOST: string,
            SMTP_PORT: number,
            SMTP_USER: string
            SMTP_PASSWORD: string
        }
    }
}