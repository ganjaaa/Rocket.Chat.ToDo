

import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { BlockElementType } from '@rocket.chat/apps-engine/definition/uikit';
import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';


export function createContextualBarBlocks(modify: IModify, viewId?: string): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();
    const date = new Date().toISOString();
    blocks.addSectionBlock({
        text: blocks.newMarkdownTextObject(`The current date-time is\n${date}`), // [4]
        accessory: { // [5]
            type: BlockElementType.BUTTON,
            actionId: 'date',
            text: blocks.newPlainTextObject('Refresh'),
            value: date,
        },
    });
    blocks.addSectionBlock({
        text: blocks.newMarkdownTextObject(`The current date-time is\n${date}`), // [4]
        accessory: { // [5]
            type: BlockElementType.BUTTON,
            actionId: 'date',
            text: blocks.newPlainTextObject('Refresh'),
            value: date,
        },
    });

    return { // [6]
        id: viewId || 'contextualbarId',
        title: blocks.newPlainTextObject('Contextual Bar'),
        submit: blocks.newButtonElement({
            text: blocks.newPlainTextObject('Submit'),
        }),
        blocks: blocks.getBlocks(),
    };
}