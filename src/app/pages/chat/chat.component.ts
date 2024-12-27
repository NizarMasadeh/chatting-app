import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { ChatService } from '../../services/chat.service';
import { ButtonModule } from 'primeng/button';
import { MessageService } from '../../services/messages/message.service';

interface Message {
  text: string;
  sent: boolean;
  id: number;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule
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
export class ChatComponent implements OnInit, AfterViewChecked {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _chatService: ChatService,
    // private _messageSercice: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  chatUsers: any;
  selectedChat: any;

  messages: Message[] = [
    {
      text: 'test', sent: false, id: 100
    },
    {
      text: 'Meee', sent: true, id: 69

    },
    {
      text: 'this is me', sent: true, id: 69

    },
    {
      text: 'this is you', sent: false, id: 100

    },
    {
      text: 'Yupp', sent: false, id: 100

    }
  ];
  inputMessage = '';

  @ViewChild('chatBody') private chatBody!: ElementRef;


  ngOnInit() {
    this.getChatUsers();
    // this._messageSercice.setUpSocket();
  }

  getChatUsers() {
    this._chatService.getUsers().subscribe({
      next: (res: any) => {
        console.log("Users: ", res);
        this.chatUsers = res;

      }, error: (error) => {
        console.error("Error fetching users", error);

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
      this.messages.push({ text: this.inputMessage, sent: true, id: 69 });
      this.inputMessage = '';
      this.reply();
    }
  }

  reply() {
    setTimeout(() => {
      const responses = [
        "Hello! How can I help?",
        "Great to hear from you!",
        "I'm here to chat.",
        "Feel free to ask anything!",
        "What's on your mind?",
      ];
      const replyMessage = responses[Math.floor(Math.random() * responses.length)];
      this.messages.push({ text: replyMessage, sent: false, id: 100 });
    }, 1000);
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}

