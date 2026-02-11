import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  async HandleMessage(@MessageBody() message: string): Promise<string> {
    console.log(message);
    return message;
  }
}
