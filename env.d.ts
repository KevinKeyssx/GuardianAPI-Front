// Note: 'import {} from ""' syntax does not work in .d.ts files.
/// <reference path="../.astro/types.d.ts" />


declare namespace App {
    interface Locals {
        user: import("better-auth").User | null;
        session: import("better-auth").Session | null;
    }
}