const isResponseSuccess = (status_code: number): boolean => {
    return status_code.toString().startsWith("2");
};

export { isResponseSuccess };
