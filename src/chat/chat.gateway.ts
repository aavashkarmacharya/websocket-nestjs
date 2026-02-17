import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Client } from 'node_modules/socket.io/dist/client';
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
  handlejoinroom(Client: Socket, room: string) {
    Client.join(room);
    Client.emit(`${Client.id} has joined the room!`);
  }
  @SubscribeMessage('sendmessage')
  handlesendmessage(client: Socket, message: string, room: string) {
    this.server.to(room).emit(message);
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
