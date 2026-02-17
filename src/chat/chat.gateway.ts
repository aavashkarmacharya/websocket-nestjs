import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { stringify } from 'querystring';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class chatgateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  onModuleInit() {
    this.server.on('connection', (Socket) => {
      console.log(`Connection established! socket id: ${Socket.id}`);
    });
  }

  @SubscribeMessage('joinroom')
  handlejoinroom(
    @ConnectedSocket() Client: Socket,
    @MessageBody() room: string,
  ) {
    Client.join(room);
    Client.to(room).emit(`${Client.id} has joined the room!`);
    console.log(`${Client.id} has joined the chatroom!`);
  }
  @SubscribeMessage('sendmessage')
  handlesendmessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
    room: string,
  ) {
    this.server.to(room).emit('message', { sender: client.id, message });
  }

  @SubscribeMessage('message')
  handlemessage(@MessageBody() message: string) {
    const data: string = message.toLocaleLowerCase();
    const val: string = 'hey';
    this.server.emit('message', {
      content: message,
    });
  }

  @SubscribeMessage('responder')
  handleresponder(@MessageBody() data: string) {
    this.server.emit('responder', {
      content: data,
    });
  }
}
