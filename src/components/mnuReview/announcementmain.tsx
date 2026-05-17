// file:    announcementmain.tsx

import AnnouncementRotator from  "./announcement1transition" ;  // transition mode

import AnnouncementBlinkType  from "./announcement2Blink";  // blink mode

import AnnouncementVerticalScroll from "./announcement3VertScroll"; // vertical scroll 

import AnnouncementVerticalScrollPause from "./announcement4VertScrollPause"; // vertical scroll pause

const messages = [
  "💡 New feature: Expand any accordion to see detailed info!",
  "📈 Forex rates updated in real-time — check the ticker!",
  "⚡ Quick tip: Hover over items for extra details.",
  "🛠️ Customize your dashboard for faster access.",
  "📊 New chart added: Track Gold prices live.",
  "✨ Smooth transitions now enabled in all sections.",
  "🔔 Stay updated! Latest announcements appear here."
];

const messagesList = [
    "Oracle",  "Microsoft", "Apple", 
]

export default function App() {

  return (
    <div>
        <div>

              <h2>Announcement Type</h2>
              
        </div>
        <center>Transition mode</center>
        <AnnouncementRotator messages={messages} interval={4000} />

        <div style={{ width: "300px", margin: "50px auto" }}>Blink Type 
            <AnnouncementBlinkType announcements={messagesList} height={40} pauseTime={20} />   
        </div>


        <div style={{ width: "300px", margin: "50px auto" }}>Vertical scroll 
            <AnnouncementVerticalScroll announcements={messagesList} height={40} speed={20} />   
        </div>


        <div style={{ width: "300px", margin: "50px auto" }}>Vertical scroll + Pause 3sec
            <AnnouncementVerticalScrollPause        
                announcements={messagesList}
                height={40}
                scrollDuration={600}
                pauseDuration={4000}
            />   
        </div> 
       

    </div>
  );
}
