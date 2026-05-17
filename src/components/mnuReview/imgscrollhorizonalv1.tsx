// file:  imgscrollhorizonalv1.tsx

import  { useRef } from "react";  // React,

import img1 from "../../assets/imgnature/nature01.jpg";  //  "../../assets/imgnature/nature01.jpg";
import img2 from "../../assets/imgnature/nature02.jpg";
import img3 from "../../assets/imgnature/nature03.jpg";
import img4 from "../../assets/imgnature/nature04.jpg";
import img5 from "../../assets/imgnature/nature05.jpg";


import img11 from "../../assets/imgnature/DBAzureSQL.jpg";
import img12 from "../../assets/imgnature/DBdbase.jpg";
import img13 from "../../assets/imgnature/DBMSAccess.jpg";
import img14 from "../../assets/imgnature/DBmySQL.jpg";
import img15 from "../../assets/imgnature/DBOracle.jpg";
import img16 from "../../assets/imgnature/DBSQLSvr.jpg";
import img17 from "../../assets/imgnature/DBSupabase.jpg";


import img21 from "../../assets/imgnature/AppAngular.jpg";
import img22 from "../../assets/imgnature/AppASPNet.jpg";
import img23 from "../../assets/imgnature/AppDocker.jpg";
import img24 from "../../assets/imgnature/AppK8s.jpg";
import img25 from "../../assets/imgnature/AppNode.jpg";
import img26 from "../../assets/imgnature/AppReact.jpg";


export default function ImageScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
      }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };


  const images = [img1,img2,img3,img4,img5,
    img11,img12, img13,img14,img15,img16,img17,
    img21,img22,img23,img24,img25,img26
  ]

  return (

    <div>
         <h2>Image scroll</h2>

         
          React Image Scroll with Paging (Left / Right Buttons)
            <br></br>
            <br></br>

    
            <div style={{ width: "100%", overflow: "hidden" }}>
           
                <div
                    ref={scrollRef}
                    style={{
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    gap: "10px",
                    marginTop: "10px",
                    }}
                >
                    {images.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt="scroll-img"
                        style={{
                        minWidth: "280px",            // ORIG: 400
                        height: "180px",              // ORIG: 250
                        borderRadius: "20px",         // ORIG: 10
                        }}
                    />
                    ))}
                </div>
                 <br></br>
                <button onClick={scrollLeft}>⬅ Previous </button>
                <button onClick={scrollRight}>➡ Next </button>


            </div>
    </div>
  );
}
