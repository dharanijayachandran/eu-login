import { Menu } from '../model/menu';

export class UserData {
    userId: string
    userName: string
    beType: string
    beName: string
    beId: string
    beTypeId: string
    isAdmin: string
    isSystemAdmin: string
    landingMenuUrl: string;
    loggedinMenus: Menu[];
    firstName: string;
    middleName: string;
    lastName: string;
    createdById:number
    gender: string;
    sessionId:string;
    authenticationType:string;
}

export class loginInput {

    signonId: string
    signonPassword: string
    authenticationType:String
    organizationId:number
}
export class UpdatePassword {
    id: string
    oldPassoword: string
    signonPassword: string
    confirmPassword: string
    createdBy: number
}