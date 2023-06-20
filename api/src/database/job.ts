import {BackReference, entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {Difficulty} from "../enums/difficulty";
import {Item} from "./item";


@entity.name('jobs')
export class Job {
    id: UUID & PrimaryKey = uuid();
    group: JobGroup & Reference;

    order: number = 0;

    title!: string;
    description!: string;
    difficulty: Difficulty = Difficulty.LOW;
    reward: number = 0;
    requirements: Item[] & BackReference;
}

@entity.name("job_groups")
export class JobGroup {
    id: UUID & PrimaryKey = uuid();

    name: string;
    jobs: Job[] & BackReference;
}

@entity.name('user_jobs')
export class UserJob {
    id: UUID & PrimaryKey = uuid();

    job!: Job & Reference;

    done: boolean = false;
    created: Date = new Date();
}