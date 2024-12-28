import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ChatService } from '../../services/chat.service';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import Pusher from 'pusher-js';
import { TransferState, StateKey, makeStateKey } from '@angular/core';

const CHAT_USERS_KEY: StateKey<any[]> = makeStateKey<any[]>('chatUsers');
@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SkeletonModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' })),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  private isBrowser: boolean;
  private isServer: boolean;

  pusher: any;
  channel: any;

  isUsersLoading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _chatService: ChatService,
    private _authService: AuthService,
    private _router: Router,
    private transferState: TransferState,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.isServer = isPlatformServer(this.platformId);
  }

  chatUsers: any;
  filteredChatUsers: any[] = [];
  selectedChat: any;
  userId: any;
  isUseresLoading = false;
  messages: any[] = [];
  inputMessage = '';
  isLoggingOut = false;
  
  @ViewChild('chatBody') private chatBody!: ElementRef;


  ngOnInit() {
    this.getChatUsers();
    this.getMessages();
    if(this.isBrowser) {

      this._chatService.message$.subscribe({
        next: (res: any) => {
          if(res !== null) {
            if(res.sender_id !== this.userId) {

          this.messages.push(res);
        }
        }
        }
      })
      this.initializePusher();
    }
  }

  private initializePusher() {
    this.pusher = new Pusher('1aaf650c0e2ae5d6f868', {
      cluster: 'ap2'
    });

    this.channel = this.pusher.subscribe('lamoor-channel');
    this.channel.bind('new-message', (message: any) => {
      if (message.sender_id !== this.userId) {
        this.messages = [...this.messages, message];
      }
    });

    this.pusher.connection.bind('connected', () => {
      console.log('Connected to Pusher');
    });

    this.pusher.connection.bind('error', (err: any) => {
      console.log('Pusher connection error:', err);
    });
  }


  getChatUsers() {
    if (this.transferState.hasKey(CHAT_USERS_KEY)) {
      this.chatUsers = this.transferState.get(CHAT_USERS_KEY, []);
      this.filterUsers();
    } else {
      this.isUsersLoading = true;
      this._chatService.getUsers().subscribe({
        next: (res: any) => {
          this.chatUsers = res.users;
          this.filterUsers();
          console.log("Got chat users from API:", this.chatUsers);
          
          if (this.isServer) {
            this.transferState.set(CHAT_USERS_KEY, this.chatUsers);
          }
          
          if (this.isBrowser) {
            console.log("Assigned to chat users (browser):", this.chatUsers);
          }
          this.isUseresLoading = false;
        },
        error: (error) => {
          this.isUseresLoading = false;

          console.error("Error fetching users", error);
        },
        complete: () => {
          this.isUsersLoading = false;
        }
      });
    }
  }
  

  private filterUsers() {
    if(this.isBrowser) {
      this.userId = localStorage.getItem('userId');

    this.filteredChatUsers = this.chatUsers.filter((user: any) => user.id !== this.userId);
    console.log("Filtered: ", this.filteredChatUsers);
    
    this.isUsersLoading = false;
    }
  }

  getMessages() {
    this._chatService.getMessages().subscribe({
      next: (res: any) => {
        this.messages = res.messages;
      }, error: (error) => {
        console.error("Error fetching messages: ", error)
        
      }
    })
  }


  onUserSelect(user: any) {
    this.selectedChat = user;
  }

  removeSelected() {
    this.selectedChat = null;
  }
  ngAfterViewChecked() {
    if (this.selectedChat) {
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (this.inputMessage.trim()) {

      const message = {
        sender_id: this.userId,
        receiver_id: this.selectedChat.id,
        message: this.inputMessage,
      }

      this.messages.push(message);

      this._chatService.sendMessage(message).subscribe({
        next: (res: any) => {
        }, error: (error) => {
          console.error("Error sending message: ", error);
        }
      })
      this.inputMessage = '';
    }
  }


  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  onLogout() {
    this.isLoggingOut = true;

    this._authService.onLogout().subscribe({
      next: (res: any) => {
        console.log("Logged out successfully", res);
        localStorage.clear();

        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 1000);
        this.isLoggingOut = false;
      }, error: (error) => {
        console.error("Error logging out", error);
        this.isLoggingOut = false;

      }
    });
  }


  ngOnDestroy() {
    if (this.channel) {
      this.channel.unbind_all();
      this.channel.unsubscribe();
    }
    if (this.pusher) {
      this.pusher.disconnect();
    }
  }

}

