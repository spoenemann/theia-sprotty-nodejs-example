import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

export const DiagramViewCommand = {
    id: 'DiagramView.command',
    label: "Say Hello"
};

@injectable()
export class DiagramViewCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(DiagramViewCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class DiagramViewMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: DiagramViewCommand.id,
            label: DiagramViewCommand.label
        });
    }
}
