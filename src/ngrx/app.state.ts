export const appStateName: string = 'appState';

export interface AppStateInterface {
    streetSettings: any;
    thingsFilter: any;
}

export class AppState implements AppStateInterface {
    public streetSettings: any;
    public thingsFilter: any;
}

export const appDefaultState: AppState = new AppState();
