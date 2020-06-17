/**
 * Generated using theia-extension-generator
 */
import { DiagramViewCommandContribution, DiagramViewMenuContribution } from './diagram-view-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";
import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(DiagramViewCommandContribution);
    bind(MenuContribution).to(DiagramViewMenuContribution);
});
