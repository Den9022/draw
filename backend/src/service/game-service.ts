
import { PlayerVo } from "./vo/player-vo";
export class GameService {

    private players: PlayerVo[];

    constructor(players: PlayerVo[]) {
        this.players = players;
        let player = players.pop();
        player.myTurn = true;
        this.players.push(player);

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
