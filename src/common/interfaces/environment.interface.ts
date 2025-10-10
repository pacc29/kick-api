type SupportedDatabaseTypes = 'mysql' | 'postgres' | 'sqlite' | 'mariadb';

export interface EnvironmentVariables {
    NODE_ENV: 'production' | 'development';
    DB_TYPE: SupportedDatabaseTypes; 
    DB_PORT: number;
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    GRANT_TYPE: string;
}

