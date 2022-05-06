// https://developer.rocket.chat/apps-engine/recipes/storing-user-input

import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export class ToDoStorage {

    public static async getRoomEntries(persis: IPersistenceRead, room: IRoom): Promise<Array<string>> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        let result: Array<string> = [];
        try {
            const records: Array<{ id: string }> = (await persis.readByAssociations(associations)) as Array<{ id: string }>;

            if (records.length) {
                result = records.map(({ id }) => id);
            }
        } catch (err) {
            console.warn(err);
        }

        return result;
    }

    public static async addRoomEntry(persis: IPersistence, room: IRoom, id: string): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id),
        ];

        try {
            await persis.updateByAssociations(associations, { id }, true);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async removeRoomEntry(persis: IPersistence, room: IRoom, id: string): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async flushRoom(persis: IPersistence, room: IRoom): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.ROOM, room.id),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async flushAll(persis: IPersistence): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
        ];

        try {
            await persis.removeByAssociations(associations);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async storeRoomId(persis: IPersistence, id: string, roomId: string): Promise<boolean> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id)
        ];

        try {
            await persis.updateByAssociations(associations, {roomId}, true);
        } catch (err) {
            console.warn(err);
            return false;
        }

        return true;
    }

    public static async getRoomId(persis: IPersistenceRead, id: string,): Promise<string | undefined> {
        const associations: Array<RocketChatAssociationRecord> = [
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, 'room-to-do'),
            new RocketChatAssociationRecord(RocketChatAssociationModel.MISC, id)
        ];

        let result: string = '';
        try {
            const [result] = await persis.readByAssociations(associations);
        } catch (err) {
            console.warn(err);
        }

        return result ? (result as any).roomId : undefined;
    }
}

