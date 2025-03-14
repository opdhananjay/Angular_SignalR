import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatserviceService } from '../chatService/chatservice.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {
  
  joinRoomForm!:FormGroup;
  
  constructor(private fb:FormBuilder,private router:Router,private chatHub:ChatserviceService){}
  
  ngOnInit():void{
    this.joinRoomForm = this.fb.group({
      user:['',Validators.required],
      room:['',Validators.required]
    })
  }

  joinRoom(){
    console.log("join room clicked");
    const {user,room} = this.joinRoomForm.value;
    this.chatHub.joinRoom(user,room).then(()=>{
      sessionStorage.setItem("user",user);
      this.chatHub.setGroupName(room);
      this.router.navigate(['/chat',])      
    }).catch((err)=>{
      console.log("error found component",err);
    })
    console.log(this.joinRoomForm.value)
  }
  
}
