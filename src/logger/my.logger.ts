import { LoggerService, LogLevel } from "@nestjs/common";
import { createLogger, format, Logger, transport, transports } from "winston";
import chalk from 'chalk';
import dayjs from 'dayjs';
import { time } from "console";


export class MyLogger implements LoggerService {

    private logger: Logger;
    constructor() {
        this.logger = createLogger({
            level: 'debug',
            // format: format.combine(
            //     format.colorize(),
            //     format.timestamp(),
            //     format.simple()
            // ),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf(({context, message, level, time}) => {
                            const strApp = chalk.green('[Nest]');
                            const strContext = chalk.yellow(`[${context}]`);
                            return `${strApp} - ${time} ${level} ${strContext} ${message}`;
                        })
                    ),
                    
                }),
                new transports.File({
                    format: format.combine(
                        format.timestamp(),
                        format.json()
                    ),
                    dirname: 'log',
                    filename: 'demo.dev.log'
                })
            ]
        })
    }

    log(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('info', message, {context, time})
    }
    error(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('error', message, {context, time})
    }
    warn(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('warn', message, {context, time})
    }
    debug?(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('debug', message, {context, time})
    }
    verbose?(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('verbose', message, {context, time})
    }
    fatal?(message: string, context: string) {
        const time = dayjs(Date.now()).format('DD/MM/YYYY HH:mm:ss');
        this.logger.log('fatal', message, {context, time})
    }
    setLogLevels?(_levels: LogLevel[]) {
        // console.log(`****INFO****[${context}] | `, message)
    }

}
