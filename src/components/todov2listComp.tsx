// file:    src/components/todov2listComp.tsx

import type { Todo } from "../types/todov2Type"
import { useState } from "react"
import CustomConfirm from "./customYN"; 

import { log } from "../config/debug";

interface Props {
  todos: Todo[]
  onDelete: (id: number) => void
  onUpdate: (id: number, name: string) => void
}

export default function TodoList({ todos, onDelete, onUpdate }: Props) {

  const [editId, setEditId] = useState<number | null>(null)
  const [editText, setEditText] = useState("") 

  const [confirmDelete, setConfirmDelete] = useState<Todo | null>(null)

  // PAGING
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)      // default rows

  const totalPages = Math.ceil(todos.length / rowsPerPage)

  const startIndex = (currentPage - 1) * rowsPerPage
  const pagedItems = todos.slice(startIndex, startIndex + rowsPerPage)

  const getPageNumbers = () => {
        const pageNumbers: number[] = []
        const maxVisible = 5

        let startPage = Math.max(1, currentPage - 2)
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        startPage = Math.max(1, endPage - maxVisible + 1)

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i)
        }

        return pageNumbers
  }



  // DELETE State
  const handleDeleteClick = (todo: Todo) => {
    setConfirmDelete(todo)
  }

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      onDelete(confirmDelete.id)
      setConfirmDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setConfirmDelete(null)
  }
      

  const startEdit = (todo: Todo) => {
    setEditId(todo.id)
    setEditText(todo.name)
  }

  const saveEdit = () => {
    if (editId !== null) {
      log("Saving edit", editId, editText);
      onUpdate(editId, editText)
      setEditId(null)
    }
  }


  return (
    <div className="gridTblFrmt">


      {/* PAGINATION START */}
      <div className="paginationRow">

        <div className="rowsPerPage">
          <span>Rows per page:</span>

          <select
            className="rowsSelect"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="paginationControls">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            |&lt;
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            &lt;
          </button>

          {getPageNumbers().map(pageNum => (
            <button
              key={pageNum}
              className={currentPage === pageNum ? "activePage" : ""}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            &gt;
          </button>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(totalPages)}
          >
            &gt;|
          </button>

        </div>
      </div>

      <br />
       {/* PAGINATION END */}


      {/* HEADER */}
      <div className="gridHeader">
          <div>Row#</div>
          <div>ID</div>
          <div>Description</div>
          <div>Actions</div>
      </div>
   
      {pagedItems.map((t,index) => 
      
          {

            const rowNumber = (currentPage - 1) * rowsPerPage + index + 1;
            
            return (

                <div key={t.id} className="gridRow">
                      
                      <div>{rowNumber}</div>
                      <div>{t.id}</div>

                      {/* DESCRIPTION */}
                      <div>
                          {editId === t.id ? (
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                            />
                          ) : (
                            t.name
                          )}
                      </div>

                      {/* ACTIONS */}
                      <div>
                          {
                          editId === t.id ? (
                                <><button className="my-buttonYN" onClick={saveEdit}>Save</button>
                                  <button className="my-buttonYN" onClick={() => setEditId(null)}>Cancel</button>
                                </>
                          ) : (
                                <><button className="my-button" onClick={() => startEdit(t)}>Edit</button>
                                  <button className="my-button"  onClick={() => handleDeleteClick(t)}>Delete</button>
                                </>
                          )
                          }
                      </div>
                </div>
            )

          } 
          
        )

      }
       

      {confirmDelete !== null && (
          <CustomConfirm
            message={
              <>
                <div>
                  Todo: <strong style={{ color: "blue" }}>
                    {confirmDelete.name}
                  </strong>
                </div>
                <div style={{ marginTop: "1em" }}>
                  Delete confirm?
                </div>
              </>
            }
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
      )}

        
  </div>
  )
}