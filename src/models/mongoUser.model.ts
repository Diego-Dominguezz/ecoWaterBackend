import { ObjectId } from 'mongodb';

export default class mongoUser {
    public constructor(
        public userName:string,
        public email: string,
        public role: string,
        public id: ObjectId,
    ) {}
}