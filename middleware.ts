// import { auth } from "./src/lib/utils/auth";

// import { defineMiddleware } from "astro:middleware";


// export const onRequest = defineMiddleware(async (context, next) => {
//     const isAuthed = await auth.api
//         .getSession({
//             headers: context.request.headers,
//         })

//     if (isAuthed) {
//         context.locals.user = isAuthed.user;
//         context.locals.session = isAuthed.session;
//     } else {
//         context.locals.user = null;
//         context.locals.session = null;
//     }

//     return next();
// });


import { auth } from './lib/utils/auth';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
    const session = await auth.api.getSession({
        headers: context.request.headers
    });
    console.log('🚀 ~ file: middleware.ts:29 ~ session:', session)

    context.locals.session = session?.session ?? null;
    context.locals.user    = session?.user    ?? null;

    return next();
});
