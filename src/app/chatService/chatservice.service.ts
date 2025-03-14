import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatserviceService {

  public connection:SignalR.HubConnection = new SignalR.HubConnectionBuilder()
  .withUrl("https://dchatapp.somee.com/chat")
  .configureLogging(SignalR.LogLevel.Information)
  .build();

  public message$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<string[]>([]);
  public message:any[] = [];
  public users:string[] = [];
  public groupName:string = '';

  constructor(){

    this.Start();

    this.connection.on("ReceiveMessage",(user:string,message:string,messageTime:string) => {
      console.log("User",user);
      console.log("message",message),
      console.log("messageTime",messageTime);
      this.message = [...this.message,{user,message,messageTime}];
      this.message$.next(this.message);
      console.log("this messages$",this.message$);
      console.log("this messages",this.message);
    });

    this.connection.on("ConnectedUser",(users:any)=>{
      console.log("connectedUser",users);
      this.connectedUsers$.next(users);
      console.log("this connectedUsers",this.connectedUsers$);
    });
  }

  // Start Coonnetion 
  public async Start(){
    try{
      await this.connection.start(); 
      console.log("connection is established");
    }catch(error){
      console.log("error start",error);
    }
  }

  // join Room
  public async joinRoom(user:string,room:string){
    return this.connection.invoke("joinRoom",{ user,room });
  }

  // Send Messge
  public async sendMessage(message:string){
    return this.connection.invoke("SendMessage",message);
  }

  // Leave Chats
  public async leaveChat(){
    return this.connection.stop();
  }

  public setGroupName(groupName:string){
    this.groupName = groupName;
  }
  
  public getGroupName(){
    return this.groupName;
  }

}
