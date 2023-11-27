import "alpinejs"
import create from "./create"

declare global {
    interface Window { 
        create: any;
    }
}

window.create = create
