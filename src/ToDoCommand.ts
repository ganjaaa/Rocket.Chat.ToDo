import { App } from '@rocket.chat/apps-engine/definition/App';
import { IModify, IRead, IHttp, IPersistence } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { createContextualBarBlocks } from './CreateContextBarBlocks';
import { ToDoDefinitions } from './ToDoDefinitions';
import { ToDoUI } from './ToDoUI';
import { ToDoStorage } from './ToDoStorage';


export class ToDoCommand implements ISlashCommand {
    public command = 'todo';
    public i18nParamsExample = 'todo_command_params';
    public i18nDescription = 'todo_command_description';
    public providesPreview = false;

    /**
     * Constructor 
     * 
     * @param app 
     */
    constructor(private readonly app: App) { }

    /**
     * Executor
     * 
     * @param context 
     * @param _read 
     * @param modify 
     */
    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const args = context.getArguments();
        const room = context.getRoom();
        const sender = context.getSender().name;
        

        if (!args?.length) {
            await modify
                .getCreator()
                .finish(await modify
                    .getCreator()
                    .startMessage()
                    .setRoom(room)
                    .setGroupable(false)
                    .setText('Usage: /todo <action> <task>, supported actions: add, del, open, flush'));
        } else if (args[0] === ToDoDefinitions.CMD_FLUSH) {
            await modify
                .getCreator()
                .finish(await modify
                    .getCreator()
                    .startMessage()
                    .setRoom(room)
                    .setGroupable(false)
                    .setText('Removing all Tasks in the room'));
            await ToDoStorage.flushRoom(persis, room);
        } else if (args[0] === ToDoDefinitions.CMD_DELETE) {
            const tasks = await ToDoStorage.getRoomEntries(read.getPersistenceReader(), room);
            const toDelete = args.slice(1).join(' ');
            if (tasks.includes(toDelete)) {
                const msg = sender + ' deleted task: ' + toDelete;
            //    await ToDoCommand.sendMessage(context, modify, msg);
            //    await ToDoPersistence.removeById(persis, toDelete);
            } else {
            //    await ToDoCommand.sendNotification(context, modify, 'There is no task "' + toDelete + '", please make sure the exact task name is used');
            }
        } else if (args[0] === ToDoDefinitions.CMD_OPEN) {
            //await UIHelper.openToDoList(modify, context);
        } else {
            //const todo = args.join(' ');
            //await ToDoPersistence.persist(persis, room, todo, room.id);
            //const msg = sender + ' created new to-do task: ' + todo;
            //await ToDoCommand.sendMessage(context, modify, msg);
        }
    }
}

