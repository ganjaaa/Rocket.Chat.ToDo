export class ToDoDefinitions {
    public static readonly ASSOCIATION_ID: string = 'room-to-do';
    public static readonly ACTION_MESSAGE: string = 'action_message_todo';
    public static readonly ACTION_OPEN: string = 'action_open_todo';
    public static readonly ACTION_DELETE: string = 'action_delete_todo';
    public static readonly ACTION_FLUSH: string = 'action_flush_todo';
    public static readonly ACTION_ADD: string = 'action_add_todo';
    public static readonly ACTION_TOGGLE: string = 'action_toggle_todo';

    public static readonly CMD_OPEN: string = 'open';
    public static readonly CMD_ADD: string = 'add';
    public static readonly CMD_DELETE: string = 'del';
    public static readonly CMD_FLUSH: string = 'flush';

    public static uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}