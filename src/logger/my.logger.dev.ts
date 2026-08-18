import { ConsoleLogger } from "@nestjs/common";

export class MyloggerDev extends ConsoleLogger {
    log(message: string, context: string): void {
        console.log(`INFO-[${context}] | `, message);
    }

    error(message: string, context: string): void {
        console.error(`ERROR-[${context}] | `, message);
    }
    
}