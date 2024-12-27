import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket: Socket;

  // private lamoorMessageSubscription = new BehaviorSubject<any>(null);
  // lamoorMessage$ = this.lamoorMessageSubscription.asObservable()

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {

    this.socket = io(environment.apiUrl);
  }

  setUpSocket(): void {
    // const merchantId = localStorage.getItem('userId');

    this.socket.on('messages', (res: any) => {
      console.log("Socket connected: ", res);

    })

    // this.socket.on('lamoorMessage', (res: any) => {
    //   if (merchantId === res.id) {
    //     this.merchantStatusSubject.next(res);
    //   }
    // })
  }

  // updateMerchantStatus(merchantStatus: any): void {
  //   this.merchantStatusSubject.next(merchantStatus);
  // }
}
