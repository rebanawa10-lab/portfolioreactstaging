// file:    src/components/mnunReview/accordion.tsx


import Accordion from "./accordionfunc"; 

function App() {
  return (
   
     <div className='DivTxtFormat'>
      <h2>Material UI Accordion Example</h2>

      <Accordion title="Section 1" >
        <p>This is the content of section 1.1</p>
        <p>This is the content of section 1.2</p>
        <p>This is the content of section 1.3</p>
        <p>This is the content of section 1.4</p>
        <p>This is the content of section 1.5</p>
      </Accordion>
      <Accordion title="Section 2">
        <p>Content for section 2 goes here.</p>
      </Accordion>

      <Accordion title="Section 3">
        <div>
          <p>Multiple elements are fine!</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      </Accordion>
    </div>

  );
}

export default App;
