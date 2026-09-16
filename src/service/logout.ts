import { deleteCookie } from "cookies-next";

export const logoutUser = () => {
    deleteCookie("token");
    deleteCookie("role");
    window.location.href = "/login";
};