import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Subscription } from "@/types";

interface FuneralDialogProps {
  subscription: Subscription;
  onClose: () => void;
}

const GUESTBOOK = [
  // Tech & Startup References
  "Elon Musk: 'I would've bought this subscription.'",
  "Steve Jobs: 'One more thing... goodbye.'",
  "Mark Zuckerberg: 'Status update: Unsubscribed.'",
  "Bill Gates: 'Windows has encountered a fatal subscription error.'",
  
  // Pop Culture
  "Darth Vader: 'I find your lack of renewal disturbing.'",
  "Yoda: 'Do or do not, there is no renew.'",
  "Batman: 'I'm not the subscription you need right now.'",
  "Spider-Man: 'With great subscription comes great responsibility.'",
  "Thor: 'This subscription was worthy.'",
  "Iron Man: 'And I... am... unsubscribed.'",
  "Doctor Strange: 'It was the only way.'",
  
  // Internet Culture
  "Doge: 'Such expired. Much wow. Very cancel.'",
  "Grumpy Cat: 'I had a subscription once. It was awful.'",
  "Nyan Cat: '🌈 Subscription.exe has stopped working'",
  "This Is Fine Dog: 'This is fine.'",
  
  // Memes
  "Subscription: 'Understandable, have a nice day.'",
  "Credit Card: 'Aight imma head out.'",
  "Bank Account: 'Stonks ↗️'",
  "Wallet: 'I can breathe again!'",
  
  // Gaming
  "Super Mario: 'Thank you subscription, but our princess is in another castle!'",
  "Pac-Man: 'Waka waka... goodbye.'",
  "Among Us: 'Subscription was The Impostor.'",
  "Portal: 'The subscription is a lie.'",
  "Minecraft: 'Subscription tried to swim in lava.'",
  
  // Movies & TV
  "Jack Sparrow: 'Why is the subscription gone?'",
  "Gandalf: 'You shall not renew!'",
  "Rick Astley: 'Never gonna give you up... except now.'",
  "The Terminator: 'Hasta la vista, subscription.'",
  "Neo: 'There is no subscription.'",
  
  // Literature
  "Shakespeare: 'To subscribe, or not to subscribe.'",
  "Poe: 'Quoth the server: 404.'",
  "Sherlock: 'Elementary, my dear Wallet.'",
  
  // Financial
  "Your Bank Account: 'One less burden to bear.'",
  "Your Wallet: 'I feel lighter already.'",
  "Your Budget: 'A moment of silence...'",
  "Your Savings: 'We shall grow stronger from this loss.'",
  "The Cancel Button: 'My purpose is fulfilled.'",
  "The Unsubscribe Link: 'Victory at last!'",
  
  // Vaporwave Aesthetic
  "ＶＡＰＯＲＷＡＶＥサブスクリプション: 'Sayonara.'",
  "ASCII Art: '(╯°□°)╯︵ ┻━┻'",
  "Windows 95: 'It's now safe to turn off your subscription.'",
  "Macintosh Plus: 'リサフランク420 / 現代のコンピュー'",
  
  // Dramatic
  "The Void: 'Another one returns to the digital aether.'",
  "The Cloud: 'Subscription status: Evaporated.'",
  "The Internet: 'F in chat for this subscription.'",
  "The Digital Reaper: 'Your free trial of life has expired.'",
  
  // Meta
  "This Message: 'Even this guestbook message will cycle away.'",
  "The Developer: 'I spent way too long writing these messages.'",
  "The UI: 'Please wait while I process this loss...'",
  "The Database: 'Row deleted successfully. Feeling empty inside.'"
];

// Only on-theme emojis
const THEME_EMOJIS = ["💀", "⚰️", "🪦", "🕯️", "🕺", "💃", "🎉", "🥀", "👻", "🪦", "🪦", "🪦"];

export const FuneralDialog = ({ subscription, onClose }: FuneralDialogProps) => {
  const [show, setShow] = useState(true);
  const [guestIdx, setGuestIdx] = useState(0);

  // Auto-close after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Guestbook cycling
  useEffect(() => {
      const interval = setInterval(() => {
      setGuestIdx(idx => (idx + 1) % GUESTBOOK.length);
    }, 2000);
      return () => clearInterval(interval);
  }, []);

  // On-theme emoji rain
  useEffect(() => {
    if (!show) return;
    let running = true;
    const createEmoji = () => {
      if (!running) return;
      const emoji = THEME_EMOJIS[Math.floor(Math.random() * THEME_EMOJIS.length)];
      const el = document.createElement('div');
      el.textContent = emoji;
      el.style.position = 'fixed';
      el.style.left = Math.random() * 90 + 'vw';
      el.style.top = '-2em';
      el.style.fontSize = '2.5rem';
      el.style.zIndex = '9999';
      el.style.pointerEvents = 'none';
      el.style.transition = 'top 2.5s linear';
      document.body.appendChild(el);
      setTimeout(() => {
        el.style.top = '100vh';
      }, 10);
      setTimeout(() => {
        document.body.removeChild(el);
      }, 2600);
    };
    const emojiInterval = setInterval(createEmoji, 250);
    return () => {
      running = false;
      clearInterval(emojiInterval);
    };
  }, [show]);

  // Get appropriate content based on subscription type
  const getFuneralContent = () => {
    if (subscription.autoRenew) {
      // Wallet funeral for auto-renewing subscriptions
      return {
        icon: '💸',
        title: 'Your Wallet Has Been Drained',
        message: `${subscription.name} has claimed another ${subscription.cost}! Your wallet will rise again next ${subscription.frequency}.`,
        guestbook: [
          "Your Wallet: 'I'll recover... eventually.'",
          "Bank Account: 'The cycle continues...'",
          "Credit Card: 'Another successful transaction!'",
          "Savings Account: 'I felt that one.'",
          "Budget Spreadsheet: 'Right on schedule!'"
        ]
      };
    } else {
      // Cemetery funeral for non-renewing subscriptions
    switch(subscription.funeralType) {
      case 'viking':
        return {
            icon: '⚔️',
            title: 'A Warrior\'s Farewell',
            message: 'This subscription has sailed to digital Valhalla.',
            guestbook: GUESTBOOK
        };
      case 'pixelated':
        return {
          icon: '👾',
          title: 'GAME OVER',
            message: 'This subscription has run out of continues.',
            guestbook: GUESTBOOK
        };
      case 'space':
        return {
          icon: '🚀',
            title: 'Lost in Digital Space',
            message: "Houston, we've lost this subscription.",
            guestbook: GUESTBOOK
        };
      default:
        return {
          icon: '⚰️',
          title: 'Digital Farewell',
            message: 'Another subscription has been laid to rest.',
            guestbook: GUESTBOOK
        };
      }
    }
  };

  const content = getFuneralContent();

  return (
    <Dialog open={show} onOpenChange={() => { setShow(false); onClose(); }}>
      <DialogContent className={cn(
        "max-w-md mx-auto bg-black/90 border text-center rounded-xl shadow-2xl p-8 flex flex-col items-center",
        subscription.autoRenew ? "border-yellow-500" : "border-vaporwave-neonPink"
          )}>
        <div className="text-6xl mb-4 animate-bounce">{content.icon}</div>
        <h2 className={cn(
          "text-2xl font-bold mb-4",
          subscription.autoRenew ? "text-yellow-500" : "text-vaporwave-neonPink"
        )}>
              {content.title}
            </h2>
        <div className="text-lg text-gray-200 mb-4">{content.message}</div>
        <div className="text-base text-gray-400 mb-6">
          {subscription.name} - ${subscription.cost}/{subscription.frequency}
          </div>
          <div className={cn(
          "bg-black/70 border rounded-lg px-4 py-2 text-sm shadow animate-pulse",
          subscription.autoRenew ? "border-yellow-500 text-yellow-200" : "border-pink-400 text-pink-200"
          )}>
          {content.guestbook[guestIdx]}
        </div>
      </DialogContent>
    </Dialog>
  );
};
