export interface IUser {
    userID: string;
    name: string;
    team?: 'a' | 'b';
    tapCount: number;
}

export interface IAppState {

    isTeamSelected: boolean,
    selectedTeam: string,
    name: string

}

export interface IAdminState {
    teams: {
        a: Array<IUser>,
        b: Array<IUser>
    },
    progress_a: number,
    progress_b: number,
    count_a: number,
    count_b: number,
    tapCount: number
}