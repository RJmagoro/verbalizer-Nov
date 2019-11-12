import { AngularFireStorage } from '@angular/fire/storage';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { InstitutionModule } from './../institution/institution.module';
import { Component, OnInit } from '@angular/core';
import { ChatadataModule } from '../chatadata/chatadata.module';
import { SignModule } from '../sign/sign.module';
import { VerbalizeServiceService } from '../verbalize-service.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


 

declare var firebase;
@Component({
  selector: 'app-userchat',
  templateUrl: './userchat.page.html',
  styleUrls: ['./userchat.page.scss'],
})
export class UserchatPage implements OnInit {

  // verificationId: any;
  // phone: string;
  // code: string;
  verificationId: any;
  code = '';
  phone: number;
  first:boolean = false;
  second:boolean = false;
  third: boolean = false;
  inst: InstitutionModule;
  showSpinner: boolean = false;
  user: SignModule;
  users: any;
  chat: any[];
  receiver: string;
  messageArray: any = [];
  chatData: ChatadataModule;
  institution: any;
  today: Date = new Date();
  userid = JSON.parse(localStorage.getItem('user-uid'));
  messages: FormGroup;
  postcomments: any;
  commentForm: FormGroup;
  myUserID: string;
  post: any;
  

  constructor(private navCtrl: NavController,private router:Router,private _service: VerbalizeServiceService, private _storage: AngularFireStorage) {
    this.messages = new FormGroup({
      message: new FormControl('', Validators.required)
    })
    this.first = true;
    
    

  }
  signIn(){
    this.second =true;
    this.first =false;
    const tell = '+27' + this.phone;
    (<any> window).FirebasePlugin.verifyPhoneNumber(tell, 60, (credential) => {
      console.log(credential);
      this.verificationId = credential.verificationId;
      
    }, (error) => {
      console.error(error);
      alert(error);
     });

 

  }
  onverify(){
    this.third = true;
    this.second = false;
    // const signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code);
    // firebase.auth().signInWithCredential(signInCredential).then((info) => {
    //   console.log(info);
      
    // }, (error) => {
    //   console.log(error);
    // });
    
     // if(this.mobile.length!=12)
    // {
    // let alert = this.alertCtrl.create({title: 'Mobile Number Required!',
    // subTitle: 'Please enter your 10 digit mobile number with +27 country code!',
    // buttons: ['OK']
    // });
    // alert.present();
    // }
    // else
    // {
    // this.http.get('https://rest.nexmo.com/sms/json?api_key=4b122182&api_secret=D4qMdoBQcH4kOIPb&from=''&text')
    // .map(res => res.json())
    // .subscribe(res => {
            
    // //alert(JSON.stringify(res));
    // this.navCtrl.push(OtpReceivePage,{mobileno:this.mobile})
    // }, (err) => {
    // alert("failed");
    // });
    // }
//     this.third = true;
//     this.second = false;
//     let signInCredential = firebase.auth.PhoneAuthProvider.
//      credential(this.phone, this.text);
//         firebase.auth().signInWithCredential(signInCredential).
//          then((info) => {
//            console.log(info);
//         }, (error) => {
//         console.log(error);
// })
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"))
    localStorage.removeItem('institution');
    //this.user = this.user[0];
    this.getInsitutions();
    this.today;
    console.log(this.today)
    console.log(this.user.uid)
    console.log(this.userid)

  }

  getUsers() {
    this._service.getUser().subscribe(res => {
      this.users = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as SignModule;
      })
      for (let i = 0; i < Object.keys(this.users).length; i++) {
        if ((this.users[i].profilepic).substring(0, 23) == "https://firebasestorage") {
        } else {
          if (this.users[i].profilepic) {
            this._storage.ref("profile/" + this.users[i].profilepic).getDownloadURL().subscribe(imgRes => {
              this.users[i].profilepic = imgRes;
            })
          }
        }
      }
    })
  }
  getInsitutions() {
    this._service.getInstitution().subscribe(res => {
      this.showSpinner = true;
      this.institution = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as InstitutionModule
      })
      console.log(' Institution ' + res)

      for (let i = 0; i < Object.keys(this.institution).length; i++) {
        if ((this.institution[i].image).substring(0, 23) == "https://firebasestorage") {
        } else {
          if (this.institution[i].image) {
            this._storage.ref("institution/" + this.institution[i].image).getDownloadURL().subscribe(imgRes => {
              this.institution[i].image = imgRes;
            })
          }
        }
      }
      this.showSpinner = false;
    })
  }


  submitMessage() {
    this.showSpinner = true;
    this.chatData = {
      message: this.messages.controls["message"].value,
      time: new Date(),
      receiver: this.receiver,
      sender: this.userid
    }
    this._service.sendAdminChat(this.chatData).then(res => {
      console.log('sent')
      console.log(this.userid)
      this.messages.reset();
    });
    console.log(this.chatData)
  }


  showMessage(institution: InstitutionModule) {
    localStorage.removeItem('institution');

    this.receiver = institution.id;
    this.inst = institution;

    
    
    this.router.navigate(['chatuser']).then(res=>{
      localStorage.setItem('institution',JSON.stringify(institution));
    })
    

    this._service.getAdminChat().subscribe(res => {
      this.chat = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ChatadataModule;
      })
      console.log(this.chat)

      console.log(this.receiver)


      //console.log(this.userid.substr(1,this.userid.length-2))
      this.messageArray.splice(0, Object.keys(this.messageArray).length);

      for (let i = 0; i < Object.keys(this.chat).length; i++) {
        if (this.chat[i].sender == this.userid && this.chat[i].receiver == this.receiver) {
          this.messageArray.push({ receiver: this.receiver, sender: this.userid, message: this.chat[i].message, time: this.chat[i].time });
          console.log(this.messageArray)
        }
        if (this.chat[i].sender == this.receiver && this.chat[i].receiver == this.userid) {
          this.messageArray.push({ sender: this.receiver, receiver: this.userid, message: this.chat[i].message, time: this.chat[i].time });
          console.log(this.messageArray)
        }
      }


    })
  }
  submitMsg() {
    this.showSpinner = true;
    this.chatData = {
      message: this.messages.controls["message"].value,
      time: new Date(),
      receiver: this.receiver,
      sender: this.userid
    }
    this._service.sendAdminChat(this.chatData).then(res => {
      console.log('sent')
      console.log(this.userid)
      this.messages.reset();
    });
    console.log(this.chatData)
  }
  showMessages(institution: InstitutionModule) {
    this.receiver = institution.id;
    this.inst = institution;

    this._service.getAdminChat().subscribe(res => {
      this.chat = res.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as ChatadataModule;
      })
      console.log(this.chat)

      console.log(this.receiver)


      //console.log(this.userid.substr(1,this.userid.length-2))
      this.messageArray.splice(0, Object.keys(this.messageArray).length);

      for (let i = 0; i < Object.keys(this.chat).length; i++) {
        if (this.chat[i].sender == this.userid && this.chat[i].receiver == this.receiver) {
          this.messageArray.push({ receiver: this.receiver, sender: this.userid, message: this.chat[i].message, time: this.chat[i].time });
          console.log(this.messageArray)
        }
        if (this.chat[i].sender == this.receiver && this.chat[i].receiver == this.userid) {
          this.messageArray.push({ sender: this.receiver, receiver: this.userid, message: this.chat[i].message, time: this.chat[i].time });
          console.log(this.messageArray)
        }
      }


    })
  }
  // commentAdd(post) {

  //   console.log(this.commentForm.controls['comment'].value);
  //   console.log(JSON.parse(localStorage.getItem('user-uid')));
  //   post.comments.splice(Object.keys(post.comments).length, 1, 
  //   { uid: this.myUserID, comment: this.commentForm.controls['comment'].value, date: new Date })
  //   //console.log(post);
  //   this._service.addC(post)

  //   this.commentForm.reset()

  }
//   submitMsg() {
//     this.showSpinner = true;
//     this.chatData = {
//       message: this.messages.controls["message"].value,
//       time: new Date(),
//       receiver: this.receiver,
//       sender: this.userid
//     }
//     this._service.sendAdminChat(this.chatData).then(res => {
//       console.log('sent')
//       console.log(this.userid)
//       this.messages.reset();
//     });
//     console.log(this.chatData)
//   }
//   sendOTP(){
// //     window.FirebasePlugin.verifyPhoneNumber(phone, 60, function (credential) => {
// //       let verificationId = credential.verificationId;
// //       thatNavCtrl.push(VerificationPage, { verificationid: verificationId, phone: phone });
// // }, (error) => {
// // console.error(error);
// // });
    
//   }
 
//   verify(){
//     let signInCredential = firebase.auth.PhoneAuthProvider.
//      credential(this.verificationId, this.code);
//         firebase.auth().signInWithCredential(signInCredential).
//          then((info) => {
//            console.log(info);
//         }, (error) => {
//         console.log(error);
// })
// }

 // }
 
  

