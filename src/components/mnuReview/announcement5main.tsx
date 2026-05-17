  // file:    src/components/mnunReview/announcementmain.tsx

  
import { useEffect , useState} from "react";  // React, 


// load JSON at runtime
// announcement5URL.json is relative to the public folder
// This allows you to update the JSON without rebuilding the app.
// import Announcement5Vert from "../../../public/announcement5URL.json" ;

import  Announcement5Vert from "./announcement5Vert";

import { log } from  "../../../src/config/debug";

interface Announcement {
  message: string;
  url?: string;
}

export default function App() {

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

// async/await
// Cleaner, easier to read.
// Works exactly the same as .then().

useEffect(() => {
  // Dynamically fetch JSON from public folder
  // Dynamic load with fetch (runtime) 
  const loadAnnouncements = async () => {
    try {
      const res = await fetch("/announcement5URL.json");
      const data = await res.json();
      log("announcement5URL data:" ,  data) // Use comma , NOT + This lets Chrome DevTools display the real object structure.
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    }
  };

  loadAnnouncements(); 
}, []);


// Fallback while loading
if (announcements.length === 0) return <div>Loading announcements...</div>;


return (
    <div>
          <div>

              <h2>Announcement with JSON file</h2>
              
          </div>

          <div style={{ width: "300px" }}>
                <div className="DivTxtFormat">
                    Vertical scroll + Pause 3sec <br></br>
                    OnMouseOver + Pause <br></br><br></br>
                </div>
                <Announcement5Vert
                announcements={announcements} // passes full {message, url} objects
                height={16}
                scrollDuration={600}
                pauseDuration={4000}
                />
          </div>
        {/* DEBUG to center announcement , margin: "50px auto" */}
    </div>
  );
}

