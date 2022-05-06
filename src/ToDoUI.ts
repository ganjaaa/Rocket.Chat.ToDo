

import { IModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { BlockElementType, BlockType, ButtonStyle, TextObjectType, UIKitActionButtonInteractionContext, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
import { ToDoStorage } from './ToDoStorage';
import { ToDoDefinitions } from './ToDoDefinitions';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class ToDoUI {

    public static async clickOpen(persistence: IPersistence, persistenceRead: IPersistenceRead, modify: IModify, context: UIKitActionButtonInteractionContext) {
        const { buttonContext, actionId, triggerId, user, room, message } = context.getInteractionData();
        // Open Sidebar
        const list = await ToDoStorage.getRoomEntries(persistenceRead, room);
        await modify.getUiController().openContextualBarView(await ToDoUI.createToDoBlocks(triggerId, persistence, room.id, modify, list), { triggerId }, user);
    }

    public static async clickOpenCMD(persistence: IPersistence, persistenceRead: IPersistenceRead, modify: IModify, context: SlashCommandContext) {
        const user = context.getSender();
        const triggerId = context.getTriggerId() ?? ToDoDefinitions.uuid();
        const room = context.getRoom();
        // Open Sidebar
        const list = await ToDoStorage.getRoomEntries(persistenceRead, room);
        await modify.getUiController().openContextualBarView(await ToDoUI.createToDoBlocks(triggerId, persistence, room.id, modify, list), { triggerId }, user);
    }

    public static async clickAddMessage(persistence: IPersistence, persistenceRead: IPersistenceRead, modify: IModify, context: UIKitActionButtonInteractionContext) {
        const { buttonContext, actionId, triggerId, user, room, message } = context.getInteractionData();
        // Add Message as ToDo
        if (typeof message === 'object' && typeof message.text === 'string' && message.text.length > 0) {
            await ToDoStorage.addRoomEntry(persistence, room, message.text);
        }
        // Open Sidebar
        const list = await ToDoStorage.getRoomEntries(persistenceRead, room);
        await modify.getUiController().openContextualBarView(await ToDoUI.createToDoBlocks(triggerId, persistence, room.id, modify, list), { triggerId }, user);
    }

    public static async clickAdd(persistence: IPersistence, persistenceRead: IPersistenceRead, modify: IModify, context: UIKitViewSubmitInteractionContext) {
        /*
        const { actionId, triggerId, user, room, view } = context.getInteractionData();

        // Add Message as ToDo
        if (typeof room === 'object' && typeof view.state === 'object') {
            //await ToDoStorage.addRoomEntry(persistence, room, view.state.addTaskInput.action_add_todo_value);
        }
        // Open Sidebar
        if (typeof room === 'object') {
            const list = await ToDoStorage.getRoomEntries(persistenceRead, room);
            await modify.getUiController().openContextualBarView(await  ToDoUI.createToDoBlocks(triggerId, persistence, room.id, modify, list), { triggerId }, user);
        }
        */
    }


    public static async clickDelete(persistence: IPersistence, persistenceRead: IPersistenceRead, modify: IModify, context: UIKitBlockInteractionContext) {
        const { actionId, triggerId, user, room, value } = context.getInteractionData();
        // Add Message as ToDo
        if (typeof room === 'object'
            && typeof value === 'string'
            && value.length > 0) {
            console.log('Remove ToDo: ' + value);
            await ToDoStorage.removeRoomEntry(persistence, room, value);
        }

        // Open Sidebar
        if (typeof room === 'object') {
            const list = await ToDoStorage.getRoomEntries(persistenceRead, room);
            await modify.getUiController().openContextualBarView(
                await ToDoUI.createToDoBlocks(triggerId, persistence, room.id, modify, list),
                 { triggerId }, user);
        }
    }


    public static async createToDoBlocks(
        id: string,
        persistence: IPersistence,
        roomId: string,
        modify: IModify,
        content?: Array<string>
    ): Promise<IUIKitContextualBarViewParam> {
        const viewId = id || ToDoDefinitions.uuid();

        //await ToDoStorage.storeRoomId(persistence,viewId, roomId);
        const blocks = modify.getCreator().getBlockBuilder();

        // Input Block
        blocks.addInputBlock({
            blockId: 'addTaskInput',
            label: blocks.newPlainTextObject('Enter new todo'),
            element: blocks.newPlainTextInputElement({
                actionId: ToDoDefinitions.ACTION_ADD + '_value',
                placeholder: blocks.newPlainTextObject('Enter your to do'),
            })
        });
        blocks.addDividerBlock();

        if (typeof content !== 'undefined') {
            for (let i = 0; i < content.length; i++) {
                blocks.addSectionBlock({
                    text: blocks.newMarkdownTextObject(content[i]), // [4]
                    accessory: {
                        type: BlockElementType.BUTTON,
                        actionId: ToDoDefinitions.ACTION_DELETE,
                        text: blocks.newPlainTextObject('X'),
                        value: content[i],
                    },
                });
            }
        }

        return {
            id: viewId,
            title: blocks.newPlainTextObject('To-Do List'),
            close: blocks.newButtonElement({
                text: blocks.newPlainTextObject('Close'),
            }),
            blocks: blocks.getBlocks(),
        };
    }

}