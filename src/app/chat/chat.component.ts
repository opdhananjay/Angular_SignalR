import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatserviceService } from '../chatService/chatservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit ,AfterViewInit{

  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('chatOuter') chatOuter!:ElementRef;
  @ViewChild('chatBox') chatBox!:ElementRef;
  @ViewChild('msg_history') msg_history!:ElementRef;

  chatsName:boolean = false;
  chatsBox:boolean = true;
  messages:any[] = [];
  inputMessgae = "";
  loggedInUserName = sessionStorage.getItem("user");
  groupName = '';
  constructor(public chatService:ChatserviceService,private router:Router){}

  ngOnInit(): void {

    this.groupName =  this.chatService.getGroupName();
    console.log("groupName",this.groupName);

    this.chatService.message$.subscribe(res => {
      this.messages = res;
      console.log("messages All Component",this.messages);
      setTimeout(() => {
        this.scrollToBottom();
      }, 50);
    })
  }

  scrollToBottom() {
    if (this.msg_history?.nativeElement) {
      this.msg_history.nativeElement.scrollTop = this.msg_history.nativeElement.scrollHeight;
    }
  }  

  ngAfterViewInit() {
    this.scrollToBottom(); // Scroll when component loads
  }

  toggleChats(){
    this.chatsName = !this.chatsName;
    this.chatsBox = !this.chatsName;
    this.chatOuter.nativeElement.classList.toggle('openClose');
    this.chatOuter.nativeElement.classList.contains('openClose') ? this.menuIcon.nativeElement.textContent = "View Connected Users" : this.menuIcon.nativeElement.textContent = "Start Chat Now"
  }

  sendMessages(){
    this.chatService.sendMessage(this.inputMessgae)
    .then(()=>{
      this.inputMessgae = '';
      setTimeout(() => {
        this.scrollToBottom();
      }, 50);
    })
    .catch((err)=>{
      console.log("error while sending message",err)
    })
  }

  leaveChat(){
    this.chatService.leaveChat()
    .then(()=>{
      this.router.navigate(["/join-room"]);
    })
  }


}
