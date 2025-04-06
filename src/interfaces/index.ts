interface ITodoItem {
    id: string;
    label: string;
    isDone: boolean;
    createdTime: number;
    updatedTime: number;
    isDeleted: boolean
    isDoing: boolean
}

interface ITimerConfig {
    pomodoro: number;
    longRest: number;
    shortRest: number
}

interface IAudio {
    id: string
    path: string
    name: string
    description: string
    image: string
}


export type {ITodoItem, ITimerConfig, IAudio}