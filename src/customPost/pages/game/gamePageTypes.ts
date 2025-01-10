
export type GameChannelPacket = {
    gameId: string;
} & ({
    type: "refresh";
    data: number;
})

export type GameOverlay = "none" | "image" | "help";
