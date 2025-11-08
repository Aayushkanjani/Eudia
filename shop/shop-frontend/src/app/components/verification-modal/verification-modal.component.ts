// shop-frontend/src/app/components/verification-modal/verification-modal.component.ts
import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { VerificationResponse } from '../../services/api-client.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import QRCode from 'qrcode';

@Component({
  selector: 'app-verification-modal',
  standalone: true,
  imports: [CommonModule, DatePipe, TruncatePipe],
  template: `
    <div 
      (click)="close.emit()" 
      class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div 
        (click)="$event.stopPropagation()"
        class="w-full max-w-lg bg-surface rounded-2xl border border-secondary shadow-xl relative"
      >
        <button 
          (click)="close.emit()"
          class="absolute top-3 right-3 text-text-muted hover:text-accent transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="p-6 border-b border-secondary/50">
          @if (verificationData.status === 'anchored' && verificationData.verification_details?.blockchain_verified) {
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h2 class="text-xl font-bold text-accent">CraftID Verified</h2>
                <p class="text-sm text-text-muted">This artwork's origin has been anchored on the blockchain.</p>
              </div>
            </div>
          } @else if (verificationData.status === 'pending') {
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <div>
                <h2 class="text-xl font-bold text-accent">Verification Pending</h2>
                <p class="text-sm text-text-muted">This artwork is scheduled to be anchored on the blockchain soon.</p>
              </div>
            </div>
          } @else {
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </span>
              <div>
                <h2 class="text-xl font-bold text-accent">Verification Issue</h2>
                <p class="text-sm text-text-muted">{{ verificationData.verification_details?.reason || 'An unknown error occurred.' }}</p>
              </div>
            </div>
          }
        </div>

        <div class="p-6 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-muted">Title</span>
            <span class="text-sm font-medium text-accent">{{ productName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-text-muted">CraftID</span>
            <span class="text-sm font-mono text-accent">{{ verificationData.public_id }}</span>
          </div>
          
          @if (verificationData.anchored_at) {
            <div class="flex justify-between items-center">
              <span class="text-sm text-text-muted">Anchored At</span>
              <span class="text-sm font-medium text-accent">{{ verificationData.anchored_at | date:'medium' }}</span>
            </div>
          }

          @if (verificationData.tx_hash) {
            <div class="flex justify-between items-center">
              <span class="text-sm text-text-muted">Transaction ID</span>
              <span class="text-sm font-mono text-accent">{{ verificationData.tx_hash | truncate:10:10 }}</span>
            </div>
          }
        </div>

        @if (verificationData.tx_hash) {
        <div class="flex justify-center rounded-b-2xl border-t border-secondary/50 bg-background">
          <div class="p-6 bg-background">
            <a 
              [href]="polygonscanBaseUrl + '0x' + verificationData.tx_hash" 
              target="_blank"
              class="w-full flex items-center justify-center gap-2 text-center py-2 px-4 rounded-lg text-background bg-primary hover:bg-primary-light transition-colors duration-300 font-semibold"
            >
              <span>View on Polygonscan</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <div class="p-6 bg-background">
            <button
              (click)="openSharePopup()"
              class="w-full flex items-center justify-center gap-2 text-center py-2 px-4 rounded-lg text-background bg-primary hover:bg-primary-light transition-colors duration-300 font-semibold"
            >
              <span>Share</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        }

      </div>
    </div>

    <!-- Share Popup -->
    @if (showSharePopup) {
      <div 
        (click)="closeSharePopup()" 
        class="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div 
          (click)="$event.stopPropagation()"
          class="w-full max-w-md bg-surface rounded-2xl border border-secondary shadow-xl relative"
        >
          <button 
            (click)="closeSharePopup()"
            class="absolute top-3 right-3 text-text-muted hover:text-accent transition-colors z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="p-6 border-b border-secondary/50">
            <h3 class="text-xl font-bold text-accent">Share Artwork</h3>
            <p class="text-sm text-text-muted mt-1">Share this verified artwork with others</p>
          </div>

          <div class="p-6 space-y-4">
            <!-- QR Code Section -->
            <div class="flex flex-col items-center justify-center bg-white rounded-lg p-4 border border-secondary">
              <canvas #qrCanvas></canvas>
              <p class="text-xs text-gray-600 mt-2">Scan to verify artwork</p>
            </div>

            <!-- Share URL with Copy Button -->
            <div class="flex items-center gap-2 p-3 rounded-lg border border-secondary bg-background">
              <input 
                type="text" 
                readonly 
                [value]="getShareUrl()"
                class="flex-1 bg-transparent text-sm text-accent font-mono outline-none truncate"
              />
              <button
                (click)="copyToClipboard()"
                class="flex-shrink-0 p-2 rounded-lg hover:bg-surface transition-colors"
                [class.bg-green-500/10]="linkCopied"
                title="Copy link"
              >
                @if (linkCopied) {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              </button>
            </div>

            <!-- Divider -->
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-secondary"></div>
              </div>
              <div class="relative flex justify-center text-xs">
                <span class="px-2 bg-surface text-text-muted">Or share via</span>
              </div>
            </div>

            <!-- Social Share Buttons -->
            <div class="space-y-3">
              <button
                (click)="shareOnTwitter()"
                class="w-full flex items-center gap-3 p-3 rounded-lg border border-secondary hover:bg-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span class="text-accent font-medium">Share on Twitter</span>
              </button>

              <button
                (click)="shareOnFacebook()"
                class="w-full flex items-center gap-3 p-3 rounded-lg border border-secondary hover:bg-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span class="text-accent font-medium">Share on Facebook</span>
              </button>

              <button
                (click)="shareOnWhatsApp()"
                class="w-full flex items-center gap-3 p-3 rounded-lg border border-secondary hover:bg-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span class="text-accent font-medium">Share on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class VerificationModalComponent implements AfterViewInit {
  @Input({ required: true }) verificationData!: VerificationResponse;
  @Input() productName: string | null = 'Artwork';
  @Output() close = new EventEmitter<void>();
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  showSharePopup = false;
  linkCopied = false;
  readonly polygonscanBaseUrl = 'https://amoy.polygonscan.com/tx/';

  ngAfterViewInit() {
    // QR code will be generated when popup opens
  }

  getShareUrl(): string {
    return `${this.polygonscanBaseUrl}0x${this.verificationData.tx_hash}`;
  }

  openSharePopup() {
    this.showSharePopup = true;
    this.linkCopied = false;
    // Wait for next tick to ensure canvas is rendered
    setTimeout(() => this.generateQRCode(), 0);
  }

  closeSharePopup() {
    this.showSharePopup = false;
    this.linkCopied = false;
  }

  generateQRCode() {
    if (this.qrCanvas?.nativeElement) {
      const shareUrl = this.getShareUrl();
      QRCode.toCanvas(this.qrCanvas.nativeElement, shareUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }

  copyToClipboard() {
    const shareUrl = this.getShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.linkCopied = true;
      setTimeout(() => {
        this.linkCopied = false;
      }, 2000);
    });
  }

  shareOnTwitter() {
    const text = `Check out my verified artwork "${this.productName}" on CraftID!`;
    const url = this.getShareUrl();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnFacebook() {
    const url = this.getShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareOnWhatsApp() {
    const text = `Check out my verified artwork "${this.productName}" on CraftID!`;
    const url = this.getShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  }
}
