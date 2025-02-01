import 'dotenv/config';
import DiscordCommandManager from '../DiscordCommandManager.js';

const commandManager = new DiscordCommandManager(process.env.APP_ID);

commandManager.addCommand(
    'test',
    'Basic command',
    1,
    [0, 1],
    [0, 1, 2],
    []
);

commandManager.addCommand(
    'create-vip-role',
    'Create a new role in the server',
    1,
    [0, 1],
    [0, 1, 2],
    [
        {
            type: 3,
            name: 'rolename',
            description: 'Name of the role to create',
            required: true,
        },
        {
            type: 6,
            name: 'owner',
            description: 'Owner of the role',
            required: true,
        },
    ]
);

commandManager.addCommand(
    'add-member-to-role',
    'Add a member to a role',
    1,
    [0, 1],
    [0, 1, 2],
    [
        {
            type: 3,
            name: 'role_owned',
            description: 'ID of the role',
            required: true,
            autocomplete: true,
        },
        {
            type: 6,
            name: 'member',
            description: 'Member to add to the role',
            required: true,
        },
    ]
);

commandManager.addCommand(
    'accept-role',
    'Accept an invitation to a role',
    1,
    [0, 1],
    [0, 1, 2],
    [
        {
            type: 3,
            name: 'invitation_role_request',
            description: 'ID of the role',
            required: true,
            autocomplete: true,
        },
    ]
);

commandManager.installCommands().then(() => {
    console.log('Commands installed successfully');
}).catch((error) => {
    console.error('Error installing commands:', error);
});