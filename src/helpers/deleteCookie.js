/*
* deleteCookie function deletes the cookie by setting the expiry date to a past date.
* @param {String} CookieName - The name of the cookie to be deleted.
*/




export default function deleteCookie(CookieName){
    document.cookie = CookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}