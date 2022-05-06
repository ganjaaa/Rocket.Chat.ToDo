
import { App } from '@rocket.chat/apps-engine/definition/App';
import { UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';
import { IAppInfo,RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';
import { IAppAccessors, IConfigurationExtend, IHttp, ILogger, IModify, IPersistence, IRead, IConfigurationModify } from '@rocket.chat/apps-engine/definition/accessors';
import { IUIKitResponse, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext, IUIKitInteractionHandler, UIKitActionButtonInteractionContext, ISectionBlock } from '@rocket.chat/apps-engine/definition/uikit';

import { ToDoUI } from './src/ToDoUI';
import { ToDoCommand } from './src/ToDoCommand';
import { ToDoDefinitions } from './src/ToDoDefinitions';

export class RoomToDoApp extends App implements IUIKitInteractionHandler {

    /**
     * Constructor
     * 
     * @param info 
     * @param logger 
     * @param accessors 
     */
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    /**
     * register Action-Buttons and Slash-Command
     * @param configuration 
     */
    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await configuration.ui.registerButton({ actionId: ToDoDefinitions.ACTION_OPEN, labelI18n: 'action_button_open_list', context: UIActionButtonContext.ROOM_ACTION });
        await configuration.ui.registerButton({ actionId: ToDoDefinitions.ACTION_MESSAGE, labelI18n: 'action_button_add_to_list', context: UIActionButtonContext.MESSAGE_ACTION });
        await configuration.slashCommands.provideSlashCommand(new ToDoCommand(this))
    }

    /**
     * Action-Button Handler
     * 
     * @param context 
     * @param read 
     * @param http 
     * @param persistence 
     * @param modify 
     * @returns 
     */
    public async executeActionButtonHandler(context: UIKitActionButtonInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        const { actionId } = context.getInteractionData();
        console.log('..................', context.getInteractionData());
        switch (actionId) {
            case ToDoDefinitions.ACTION_OPEN:
                await ToDoUI.clickOpen(persistence, read.getPersistenceReader(), modify, context);
                break;
            case ToDoDefinitions.ACTION_MESSAGE:
                await ToDoUI.clickAddMessage(persistence, read.getPersistenceReader(), modify, context);
                break;
        }
        return context.getInteractionResponder().successResponse();
    }

    /**
     * Block Handler
     * 
     * @param context 
     * @param _read 
     * @param _http 
     * @param _persistence 
     * @param modify 
     * @returns 
     */
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, read: IRead, _http: IHttp, persistence: IPersistence, modify: IModify) {
        const { actionId } = context.getInteractionData();
        switch (actionId) {
            case ToDoDefinitions.ACTION_DELETE:
                await ToDoUI.clickDelete(persistence, read.getPersistenceReader(), modify, context);
                break;
           //case ToDoDefinitions.ACTION_ADD:
                //await ToDoUI.clickAdd(persistence, read.getPersistenceReader(), modify, context);
                // return context.getInteractionResponder().updateModalViewResponse(modal);
               // break;
        }

        const data = context.getInteractionData();
        console.log('==============', data);
        return { success: true };
    }

    /**
     * View Handler
     * 
     * @param context 
     * @returns 
     */
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead,  http: IHttp, persistence: IPersistence, modify: IModify): Promise<IUIKitResponse> {
        // I NEED HERE A ROOM ID BUT ITS EMPTY
        const { actionId, appId, room, triggerId, view, user  } = context.getInteractionData();
    
        console.log(actionId);
        console.log(room);
        console.log(triggerId);
        console.log(view);

        //await ToDoUI.clickAdd(persistence, read.getPersistenceReader(), modify, context);
        return { success: true };
    }


    /**
     * Disable Event
     * 
     * @param configurationModify 
     */
    public async onDisable(configurationModify: IConfigurationModify): Promise<void> {
        //const persistenceRead = this.getAccessors().reader.getPersistenceReader();
        //StorageHelper.flushAll(persistenceRead);
    }


}