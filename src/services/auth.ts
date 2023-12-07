import { getToday } from "../utils/getToday";

export const validatePassword = (password: string): boolean => {
    const currentPassword = getToday().split("/").join("");
    // 1 - 10/10/2023
    // 2 - [10,10,2023]
    // 3 - 10102023
    return currentPassword === password;
};

export const createToken = () => {
    const currentPassword = getToday().split("/").join("");
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`;
};

export const validateToken = (token: string) => {
    const currentPassword = createToken();
    return token === currentPassword;
};
