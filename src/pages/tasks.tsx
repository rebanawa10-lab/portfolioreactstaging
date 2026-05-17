// file:    src/pages/tasks.tsx
//          FastAPI 


import TaskTable from "../components/tasktableGRID" ; 
import TaskForm from "../components/taskform";  
import { useState } from "react";
import TooltipWrapper from "../components/customTooltipWrapper";  

export default function TasksPage() {
  const [reload, setReload] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();

  return (
    <>
      <h2>CRUD Tasks List</h2>

      <TooltipWrapper
        title={
          <>
            - This module allows users to manage their tasks.<br />
            - A task requires a name and a completion status.<br />
            - Tasks can be edited or deleted.<br />
            - Click the Row header to sort or filter the data.<br />
          </>
        }
        maxWidth={500}
      >
        <span className="my-cell">
          &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
        </span>
      </TooltipWrapper>

      <br></br><br></br>
      <TaskForm
        id={editingId}
        onSuccess={() => {
          setReload(!reload);
          setEditingId(undefined);
        }}
        onCancel={() => setEditingId(undefined)}
      />

      <TaskTable
        key={reload.toString()}
        onEdit={(id) => setEditingId(id)}
        onReload={() => setReload(!reload)}
        onCancelEdit={() => setEditingId(undefined)}
      />
    </>
  );
}