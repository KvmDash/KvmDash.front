export const TokenStorage = {
    setToken: (token: string) => {
        localStorage.setItem('jwt_token', token);
    },
    getToken: () => {
        return localStorage.getItem('jwt_token');
    },
    removeToken: () => {
        localStorage.removeItem('jwt_token');
    }
};