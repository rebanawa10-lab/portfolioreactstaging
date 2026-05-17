// file:    txtvw.tsx

import { useState } from "react";
import sampleText1 from "./txtsample1.txt?raw"; // ?raw is a Vite feature that loads file content as string.
import sampleText2 from "./txtsample2.txt?raw"; 

const openWindow = (url: string) => {

    const width = 1100;
    const height = 750;

    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);

    window.open(url, "_blank",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
     );

};

export default function txtvw() {

    const [text1] = useState(sampleText1);
    const [text2] = useState(sampleText2);

    return (

        <div>
            <a href="https://react.dev/learn"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent Tree selection
                    openWindow("https://react.dev/learn");
                }}
                style={{ color: "#1976d2", textDecoration: "none" }}
            >React v19.2</a>
            <br></br>

            <pre className='DivTxtFormat'>{text1}</pre>
            <div className='DivTxtFormat'>{text2}</div>

        </div>

    );
}