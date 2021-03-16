import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RestService } from './service/rest-service';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/components/common/messageservice';
import { RegistrationComponent } from './registration/registration.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RoomListComponent } from './main-page/room-list/room-list.component';
import { ChatComponent } from './room/chat/chat.component';
import { RoomComponent } from './room/room.component';
import { SocketService } from './service/socket-service';
import { GameSpaceComponent } from './room/game-space/game-space.component';
import { CanvasComponent } from './room/game-space/canvas.component';


const config: SocketIoConfig = { url: 'http://localhost:4000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    MainPageComponent,
    RoomListComponent,
    ChatComponent,
    RoomComponent,
    GameSpaceComponent,
    CanvasComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    RestService,
    SocketService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
