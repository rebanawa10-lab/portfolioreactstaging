// file: src/components/taskform.tsx


import { useState, useEffect } from "react";
import { createTask, updateTask, getTaskById } from "../api/taskAPI";  

interface Props {
  id?: number;
  onSuccess: () => void;
}

export default function TaskForm({ id, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      getTaskById(id)
        .then((task) => {
          setName(task.name);
          setIsCompleted(task.iscompleted);
        })
        .catch((err) => setError("Failed to load task data."));
    } else {
      reset();
    }
  }, [id]);

  const reset = () => {
    setName("");
    setIsCompleted(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      iscompleted: isCompleted,
    };

    try {
      if (id) {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }
      reset();
      onSuccess();
    } catch (err) {
      setError("An error occurred while saving the task.");
      console.error("Error:", err);
    }
  };

    // ** KEEP
    // DEBUG MODE:Manually trigger an error for testing
    //   const triggerErrorSelfTest = () => {
    //     setError("This is a test error message!");
    //   };


  return (
    <form onSubmit={handleSubmit} className="form-horizontal">
      <div>
        {/* <label htmlFor="taskName">Task Name</label> */}
        <input
          id="taskName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task name"
          required
          style={{ width: '275px' }}
        />
      </div>
       
      <div className="form-row">
        <input
          type="checkbox"
          id="isCompleted"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <label htmlFor="isCompleted" className="form-row__label" >Completed</label>
      </div>

      <button type="submit" className="my-button"  >Create</button>

      {error && <div className="errMsg" >{error}</div>}

      <br></br><br></br><br></br>
      {/* ** KEEP */}
      {/* DEBUG MODE: Button to manually trigger the error */}
      {/* <button type="button" className="my-buttonExt"  onClick={triggerErrorSelfTest}>Selftest: Trigger Error</button> */}
      
    </form>
  );
}
