export const prodEnviroment = {
    host: process.env.DATABASE_HOST_PROD,
    port: process.env.DATABASE_PORT_PROD ? parseInt(process.env.DATABASE_PORT_PROD) : 3306,
    username: process.env.MYSQL_USER_PROD,
    password: process.env.MYSQL_PASSWORD_PROD,
    database: process.env.MYSQL_DATABASE_PROD
}

