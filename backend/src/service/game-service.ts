
import { PlayerVo } from "./vo/player-vo";
export class GameService {

    private players: PlayerVo[];

    constructor(players: PlayerVo[]) {
        this.players = players;
    }

    public getGamePlayers(): PlayerVo[] {
        return [...this.players];
    }

    private prepareNextTurn(): void {
        
    }

    /*public guess(): MoveResult {

        const moveResult = MoveResult.validResult();
        this.prepareNextTurn();
        return moveResult;
    }*/
}
