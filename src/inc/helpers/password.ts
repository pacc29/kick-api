import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string, saltRounds: number = 10): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
}

export const isMatch = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};