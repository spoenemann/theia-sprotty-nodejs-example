export interface Point {
    readonly x: number
    readonly y: number
}

export interface Dimension {
    readonly width: number
    readonly height: number
}

export interface Bounds extends Point, Dimension {
}
