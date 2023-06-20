import {BackReference, entity, PrimaryKey, Reference, uuid, UUID} from "@deepkit/type";
import {Difficulty} from "../enums/difficulty";
import {Item} from "./item";


@entity.name('jobs')
export class Job {
    id: UUID & PrimaryKey = uuid();

    title!: string;
    description!: string;
    difficulty: Difficulty = Difficulty.LOW;
    reward: number = 0;
    requirements: Item[] & BackReference;
}

@entity.name('user_jobs')
export class UserJob {
    id: UUID & PrimaryKey = uuid();

    job!: Job & Reference;
    created: Date = new Date();

}