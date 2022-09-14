import { IncomingMessage } from "http";

export function getCookieFromBrowser(name: string): string | undefined {
    const rawCookie = document.cookie.split(";").find(c => c.trim().startsWith(`${name}=`));
    const cookie = rawCookie?.split("=")[1];
    return cookie;
}

export function getCookieFromServer(name: string, req: IncomingMessage | undefined): string | undefined {
    if (!req || !req?.headers.cookie) {
        return undefined
    }

    const rawCookie = req?.headers.cookie?.split(";").find(c => c.trim().startsWith("token="));
    const cookie = rawCookie?.split("=")[1];
    return cookie;
}