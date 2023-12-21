import { User } from "./User";
import {DateTime} from 'luxon';

class Penalty {

    readonly id: number;
    readonly description: string;
    readonly days: number;
    readonly userId: number;
    readonly startDate: Date;

    constructor(prisma: {id: number, description: string, days: number, userId: number, startDate: Date}) {
        this.id = prisma.id;
        this.description = prisma.description;
        this.days = prisma.days;
        this.userId = prisma.userId;

        this.startDate = prisma.startDate;
    }
}

export {
    Penalty
}