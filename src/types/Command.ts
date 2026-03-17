import { IGroup } from '../models/Group.js';
import { IUser } from '../models/User.js';

export interface CommandContext {
    bot: {
        sendMessage: (jid: string, content: any, options?: any) => Promise<any>;
        sock: any;
        groupMetadata: (jid: string) => Promise<any>;
        groupParticipantsUpdate: (jid: string, participants: any[], action: any) => Promise<any>;
    };
    msg: any;
    sender: string;
    senderLid: string;
    senderPhone: string | null;
    chatId: string;
    isGroup: boolean;
    body: string;
    text: string;
    args: string[];
    command: string;
    prefix: string;
    isCmd: boolean;
    isPrembot: boolean;
    isSubbot: boolean;
    isSpecialBot: boolean;
    isFromMe: boolean;
    isOwner: boolean;
    userData: IUser;
    dbService: any;
    gachaService: any;
    cacheManager: any;
    shopService: any;
    levelService: any;
    economySeason: any;
    tokenService: any;
    prembotManager: any;
    from: {
        id: string;
        jid: string;
        name: string;
    };
    reply: (text: string, options?: any) => Promise<any>;
    replyWithAudio: (url: string, options?: any) => Promise<any>;
    replyWithVideo: (url: string, options?: any) => Promise<any>;
    replyWithImage: (url: string, options?: any) => Promise<any>;
    download: (message?: any) => Promise<Buffer>;
    react: (emoji: string) => Promise<any>;
}

export interface Command {
    commands: string[];
    tags?: string[];
    help?: string[];
    before?: (ctx: CommandContext) => Promise<void | boolean>;
    execute: (ctx: CommandContext) => Promise<any>;
}
