/// <reference types="astro/client" />

import type { Session } from 'auth-astro/server';


declare global {
    namespace App {
        interface Locals {
            session: Session | null;
        }
    }
}