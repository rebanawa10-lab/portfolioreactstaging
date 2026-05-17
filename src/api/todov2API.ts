// file:    src/api/todov2.ts
//          NODEJS API

import type { Todo } from "../types/todov2Type"; 

import { log } from "../../src/config/debug";

const API = `${import.meta.env.VITE_NODEJS_API || ""}/api/todo`
// log("Todo MS SQL SVR:", API); 

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(API)

  if (!res.ok) {
    throw new Error("Failed to fetch todos")
  }

  return res.json() 
}


export async function createTodo(name: string): Promise<Todo> {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })

  if (!res.ok) {
    throw new Error("Failed to create todo")
  }

  const data = await res.json()
  log("Created:", data)   // 👈 debug
  return data
}
 

export async function updateTodo(id: number, name: string): Promise<Todo> {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })

  if (!res.ok) {
    throw new Error("Failed to update todo") 
  }

  return res.json() 
}


export async function deleteTodo(id: number): Promise<{ id: number }> {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE" 
  })

  if (!res.ok) {
    throw new Error("Failed to delete todo")
  }

  return res.json()
}

    