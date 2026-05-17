
// file:    imgscrollhorizonalv2.tsx
// React Slider – 4 Images Per Scroll (Paging)

import  { useRef, useState } from "react"; // React,

import img1 from "../../assets/imgnature/nature01.jpg";
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
  // const scrollRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

    const images = [
        img1,img2,img3,img4,
        img5,img11,img12, img13,
        img14,img15,img16,img17,
        img21,img22,img23,img24,
        img25,img26
    ]


  const imagesPerPage = 4;
  const totalPages = Math.ceil(images.length / imagesPerPage);


  const scrollToPage = (pageIndex: number) => {
    const container = scrollRef.current;

    if (!container) return; 

    const width = container.clientWidth;

    container.scrollTo({
      left: width * pageIndex,
      behavior: "smooth",
    });

    setPage(pageIndex);
  };

  const next = () => {
    if (page < totalPages - 1) {
      scrollToPage(page + 1);
    }
  };

  const prev = () => {
    if (page > 0) {
      scrollToPage(page - 1);
    }
  };

  return (
        <div>

            <h2>Image scroll ver2</h2>
            
            React Slider - 4 Images Per Scroll (Paging)
            <br></br>
            <br></br>

            <div style={{ width: "1200px", margin: "auto" }}>
            
               
                <div
                    ref={scrollRef}
                    style={{
                    display: "flex",
                    overflow: "hidden",
                    scrollBehavior: "smooth",
                    gap: "8px",
                    }}
                >
                    {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt="slide"
                        style={{
                        width: "25%", // 4 per row
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "12px",   // 👈 rounded corners
                        }}
                    />
                    ))}
                </div>
                <br></br>
                <button onClick={prev} disabled={page === 0}> ⬅ Previous </button>
                <button onClick={next} disabled={page === totalPages - 1}> ➡ Next </button>


            </div>
         </div>

  );
}
