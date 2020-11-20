import { Component, Input, OnInit } from '@angular/core';
import { PlayerVo } from 'src/app/vo/player-vo';
import { RestService } from 'src/app/service/rest-service';
import { UserVo } from 'src/app/vo/user-vo';
import { SocketMessage } from 'src/app/vo/socket-message';
import { SocketService } from 'src/app/service/socket-service';
import { MoveResultVo } from 'src/app/vo/move-result-vo';
import { MessageService } from 'primeng/components/common/messageservice';
import { CanvasComponent } from './canvas.component';

@Component({
  selector: 'app-game-space',
  templateUrl: './game-space.component.html',
  styleUrls: ['./game-space.component.scss']
})
export class GameSpaceComponent implements OnInit {

  private static EVENT_GUESS = 'guess';

  public loggedInUserId: number;

  public hostId: number;

  @Input() gamePlayers: PlayerVo[];
  @Input() roomId: number;
  @Input() restService: RestService;
  @Input() socketService: SocketService;
  @Input() messageService: MessageService;

  constructor() {
    this.gamePlayers = [];
    //this.init();
  }

  init(): void {
    

  }

  ngOnInit() {
    this.prepareGame();
  } 

  private prepareGame(): void {
    const roomName = `room-${this.roomId}`;
    //this.socketService.addEventHandler(roomName, GameSpaceComponent.EVENT_GUESS, this.handleGuess.bind(this));

    this.loggedInUserId = this.restService.getLoggedInUser().id;
  }

}
