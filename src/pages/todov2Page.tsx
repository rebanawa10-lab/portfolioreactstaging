// file:    src/pages/todov2Page.tsx


import { useEffect, useState } from "react"
import type { Todo } from "../types/todov2Type";  
import { getTodos, createTodo, deleteTodo, updateTodo } from "../../src/api/todov2API" ; 
import TodoList from "../../src/components/todov2listComp"; 
import TodoForm from "../../src/components/todov2formComp"; 
import TooltipWrapper from "../components/customTooltipWrapper"; 

function App() {

  // Prevent duplicate adds (UX improvement)
  const [loading, setLoading] = useState(false)

  const [todos, setTodos] = useState<Todo[]>([])

  const load = async () => {
    const data = await getTodos()
    setTodos(data)
  }

  useEffect(() => {
    load()
  }, [])


  // Prevent duplicate adds (UX improvement)
  const addTodo = async (name: string) => {
    if (loading) return

    setLoading(true)
    try {
      const newTodo = await createTodo(name)
      setTodos(prev => [...prev, newTodo])
    } finally {
      setLoading(false)
    }
  }

  const removeTodo = async (id: number) => {
    await deleteTodo(id)
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }


  // UPDATE
  const handleUpdate = async (id: number, name: string) => {
    const updated = await updateTodo(id, name)

    setTodos(prev =>
      prev.map(t =>
        t.id === id ? (updated || { ...t, name }) : t
      )
    )

  }

  return (
    <>
        <h2>CRUD To-Do list</h2>

        <TooltipWrapper
            title={
            <>
                The <b>CRUD To-Do List module</b> is a simple task management component that allows users to create, view, update, and delete tasks.<br /><br />
                It demonstrates a full <b>CRUD workflow</b> using a React frontend and an API backend.<br /><br />

                * Create, Read, Update, and Delete (CRUD) are the four operations (actions) of user interface.<br></br><br></br>
            </>
            }
           maxWidth={850}
        >
            <span className="my-cell">
            &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
            </span>
        </TooltipWrapper>


        <br></br><br></br>

        <TodoForm onCreate={addTodo} />

        <TodoList
          todos={todos}
          onDelete={removeTodo}
          onUpdate={handleUpdate}
        />
   
  </>
  )
}

     

  {/* OTHR 
  // import Accordion from "../components/mnuReview/accordionfunc";

     <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0 }}>CRUD To-Do List</h2>
        </div>

  
  <Accordion title="Overview">
        <p className="DivTxtFormatHighlight">            
        The <b>CRUD To-Do List module</b> is a simple task management component that allows users to create, view, update, and delete tasks.<br></br><br></br>
        It demonstrates a full <b>CRUD workflow</b> using a React frontend and an API backend.<br></br><br></br>

        * Create, Read, Update, and Delete (CRUD) are the four operations (actions) of user interface.<br></br><br></br>
        </p>    
  </Accordion> */}

export default App