export const BE_URL = 'http://192.168.0.9:3001';
export const BE_API_URL = BE_URL + '/api/v1';
export const CommonRegex = {
    email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    password: /^(?=.*[\d])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{0,}$/,
    username: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,}$/,
};
export const SECRET_KEY_ASYNC_STORAGE = 'EXAMPLE_ASYNC_STORAGE_SECRET';
