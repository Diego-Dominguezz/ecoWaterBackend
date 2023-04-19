import { ObjectId } from "mongodb";

export default class MongoPlant {
    public constructor(
        public id: ObjectId,
        public name: string,
        public size: 'small' | 'medium' | 'large',
        public waterSchedule: waterSchedule,
        public waterHistory: [waterSchedule],
        public msToWater: number,
        public plantsGroupId: string,
        public plantOwner: string,
        public plantStats: PlantStats,
    ){
    }
}
interface waterSchedule {
    id? : string
    start: EpochTimeStamp;
    end: EpochTimeStamp;
    duration: number;
    createdByUserId: ObjectId
}
interface PlantStats{
    id: string
    humidity: string;
    daysAlive: number;
    timesWatered: number;
    hitpoints: number; // max 100%
}