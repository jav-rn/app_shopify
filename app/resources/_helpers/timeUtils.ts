import type { TimeInterval } from "../_interfaces/time";

/**
 * Given a amount of time and a time unit (seconds, days, weeks, etc), compute the time in milliseconds
 */
export function getTimeInmilliseconds (timeAmount: number, timeUnit: TimeInterval) {
    const [s, m, h, d, w] = [
        1000,                    // seconds
        60 * 1000,               // minuts
        3600 * 1000,             // hours
        24 * 3600 * 1000,        // days
        7 * 24 * 3600 * 1000,    // weeks
    ];
    
    let timeInMilliseconds: number;

    switch(timeUnit) {
        case 's':
            timeInMilliseconds = timeAmount * s;
            break;
        case 'm':
            timeInMilliseconds = timeAmount * m;
            break;
        case 'h':
            timeInMilliseconds = timeAmount * h;
            break;
        case 'd':
            timeInMilliseconds = timeAmount * d;
            break;
        case 'w':
            timeInMilliseconds = timeAmount * w;
            break;
        default:
            throw new Error('Unrecognized time unit');
    }

    return timeInMilliseconds
}