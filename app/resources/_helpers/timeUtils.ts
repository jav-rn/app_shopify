import type { TimeInterval } from "../_interfaces/time";

/**
 * Given a amount of time and a time unit (seconds, days, weeks, etc), compute the time in milliseconds
 */
export function getTimeInmilliseconds (timeAmount: number, timeUnit: TimeInterval) {
    const [s, mi, h, d, w, m] = [
        1000,                    // seconds
        60 * 1000,               // minuts
        3600 * 1000,             // hours
        24 * 3600 * 1000,        // days
        7 * 24 * 3600 * 1000,    // weeks
        30 * 24 * 3600 * 1000,   // months
        365 * 24 * 3600 * 1000   // year
    ];
    
    let timeInMilliseconds: number;

    switch(timeUnit) {
        case 's':
            timeInMilliseconds = timeAmount * s;
            break;
        case 'mi':
            timeInMilliseconds = timeAmount * mi;
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
        case 'm':
            timeInMilliseconds = timeAmount * m;
            break;
        default:
            throw new Error('Unrecognized time unit');
    }

    return timeInMilliseconds
}