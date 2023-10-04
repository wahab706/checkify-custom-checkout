export const setAccessToken = (value) => {
    let name = '_UserSession';
    let days = 7;
    let expires = '';
    let path = '/'
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value}${expires}; path=${path}`;
};

export const getAccessToken = () => {
    let cookieName = '_UserSession';
    if (document.cookie.length > 0) {
        let cookieStart = document.cookie.indexOf(cookieName + '=');
        if (cookieStart !== -1) {
            cookieStart = cookieStart + cookieName.length + 1;
            let cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            return window.unescape(document.cookie.substring(cookieStart, cookieEnd));
        }
    }
    return '';
};