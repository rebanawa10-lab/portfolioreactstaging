// file:    src/components/todov2formComp.tsx


import { useState } from "react"

interface Props {
  onCreate: (name: string) => void
}

export default function TodoForm({ onCreate }: Props) {

  const [name, setName] = useState("") 

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    onCreate(name)
    setName("")
  }

  return (
    <form onSubmit={submit} className="form-horizontal">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter todo"
        required
        style={{ fontSize: "12px", fontFamily: "Arial", padding: "6px 8px" }}
      />&nbsp;
      <button className="my-button">Add</button>
    </form>
  )
}