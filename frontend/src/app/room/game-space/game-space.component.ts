import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PlayerVo } from 'src/app/vo/player-vo';
import { RestService } from 'src/app/service/rest-service';
import { UserVo } from 'src/app/vo/user-vo';
import { SocketMessage } from 'src/app/vo/socket-message';
import { SocketService } from 'src/app/service/socket-service';
import { MoveResultVo } from 'src/app/vo/move-result-vo';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'app-game-space',
  templateUrl: './game-space.component.html',
  styleUrls: ['./game-space.component.scss']
})
export class GameSpaceComponent implements OnInit {


  private static EVENT_GUESS = 'guess';
  private static EVENT_DRAW = 'draw';

  public hostId: number;
  public loggedInUser: PlayerVo;

  private _gamePlayers: PlayerVo[];
  private _restService: RestService;
  private _socketService: SocketService;
  private _messageService: MessageService;
  private _roomId: number;

  private canvas: CanvasRenderingContext2D;

  @Input()
  public set gamePlayers(gamePlayers: PlayerVo[]) {

    this._gamePlayers = gamePlayers;
  }

  @Input()
  public set restService(restService: RestService) {

    this._restService = restService;
  }

  @Input()
  public set socketService(socketService: SocketService) {

    this._socketService = socketService;
  }

  @Input()
  public set messageService(messageService: MessageService) {

    this._messageService = messageService;
  }
  @Input()
  public set roomId(roomId: number) {

    this._roomId = roomId;
  }
  /*@Input() roomId: number;
  @Input() restService: RestService;
  @Input() socketService: SocketService;
  @Input() messageService: MessageService;*/

  constructor() {
    //this.gamePlayers = [];
    console.log(this._gamePlayers);
    /*this.loggedInUser = this._gamePlayers.find(player => player.userData.id == this._restService.getLoggedInUser().id);
    console.log(this._gamePlayers);
    console.log(this.loggedInUser);
    console.log(this._roomId);*/
    this.init();
  }

  init(): void {
    

  }

  ngOnInit() {
    this.prepareGame();
  } 

  private prepareGame(): void {
    const roomName = `room-${this.roomId}`;
    this.socketService.addEventHandler(roomName, GameSpaceComponent.EVENT_DRAW, this.handleDraw.bind(this));

  }

  public draw(): void {
    this.socketService.emit(`room-${this.roomId}`, GameSpaceComponent.EVENT_DRAW, SocketMessage.withData(this.canvas));
  }

  private handleDraw(socketMessage: SocketMessage): void {
    this.canvas = socketMessage.data;
  } 

}
