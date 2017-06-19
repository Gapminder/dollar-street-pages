export const appState: string = 'appState';

export interface AppStateInterface {
    streetSettings: any;
    thingsFilter: any;
}

export const appDefaultState: AppStateInterface = {
    thingsFilter: null,
    streetSettings: null
}

export class AppState implements AppStateInterface {
    public streetSettings: any;
    public thingsFilter: any;
}
