import {handleTestCommand} from "../command/testCommand.js";
import {handleCreateRoleCommand} from "../command/createVipRole.js";
import {handleAddMemberToRoleCommand} from "../command/addMemberToRole.js";
import { handleAcceptRoleVipCommand} from "../command/acceptRoleVip.js";

export const commandHandlers = {
    'test': handleTestCommand,
    'create-vip-role': handleCreateRoleCommand,
    'add-member-to-role': handleAddMemberToRoleCommand,
    'accept-role': handleAcceptRoleVipCommand,
};
