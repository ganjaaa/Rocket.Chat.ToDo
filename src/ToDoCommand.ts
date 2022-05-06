import { IModify, IRead, IHttp, IPersistence, IModifyCreator, IMessageBuilder, INotifier } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';
import { ToDoDefinitions } from './ToDoDefinitions';
import { ToDoStorage } from './ToDoStorage';


export class ToDoCommand implements ISlashCommand {
    public command: string = 'todo';
    public i18nDescription: string = 'todo_command_description';
    public i18nParamsExample: string = 'todo_command_params';
    public providesPreview: boolean = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
        const args = context.getArguments();
        const room = context.getRoom();

        if (!args?.length) {
            // wrong argument
            await ToDoCommand.sendNotification(context, modify, 'Usage: /todo <action> <task>, supported actions: '
                + ToDoDefinitions.CMD_OPEN + ', '
                + ToDoDefinitions.CMD_ADD + ', '
                + ToDoDefinitions.CMD_DELETE + ', '
                + ToDoDefinitions.CMD_FLUSH);


        } else if (args[0] === ToDoDefinitions.CMD_OPEN) {
            // open todo list


        } else if (args[0] === ToDoDefinitions.CMD_ADD) {
            // add new todo
            const todo = args.slice(1).join(' ');
            await ToDoStorage.addRoomEntry(persis, room, todo);
            await ToDoCommand.sendNotification(context, modify, 'Added: "' + todo + '"');


        } else if (args[0] === ToDoDefinitions.CMD_DELETE) {
            // delete single todo
            const tasks = await ToDoStorage.getRoomEntries(read.getPersistenceReader(), room);
            const toDelete = args.slice(1).join(' ');
            if (tasks.includes(toDelete)) {
                await ToDoStorage.removeRoomEntry(persis, room, toDelete);
                await ToDoCommand.sendNotification(context, modify, 'Removed: "' + toDelete + '"');
            } else {
                await ToDoCommand.sendNotification(context, modify, 'There is no task "' + toDelete + '", please make sure the exact task name is used');
            }


        } else if (args[0] === ToDoDefinitions.CMD_FLUSH) {
            // flush all todos in the current room
            await ToDoCommand.sendNotification(context, modify, 'Removing all Tasks in the room');
            await ToDoStorage.flushRoom(persis, room);

            
        } else {
            // wrong argument
            await ToDoCommand.sendNotification(context, modify, 'Usage: /todo <action> <task>, supported actions: '
                + ToDoDefinitions.CMD_OPEN + ', '
                + ToDoDefinitions.CMD_ADD + ', '
                + ToDoDefinitions.CMD_DELETE + ', '
                + ToDoDefinitions.CMD_FLUSH);
        }
    }

    public static async sendNotification(context: SlashCommandContext, modify: IModify, messageText: string): Promise<void> {
        const sender = context.getSender(); // the user calling the slashcommand
        const room = context.getRoom(); // the current room

        const messageStructure = await modify.getCreator().startMessage();
        messageStructure.setSender(sender).setRoom(room).setText(messageText);

        await modify.getNotifier().notifyUser(sender, messageStructure.getMessage());
    }
}

