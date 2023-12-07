export const encryptMatch = (id: number) => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
};

export const decryptMatch = (match: string) => {
    const decrypted = match
        .replace(`${process.env.DEFAULT_TOKEN}`, "")
        .replace(`${process.env.DEFAULT_TOKEN}`, "");
    return parseInt(decrypted);
};
