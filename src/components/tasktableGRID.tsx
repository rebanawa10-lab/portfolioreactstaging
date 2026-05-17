// file: src/components/tasktableGRID.tsx


import CustomConfirm from "./customYN";
import React, { useState, useEffect } from "react";
import { getTasks, deleteTask, updateTask } from "../api/taskAPI"; 
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import type {
  GridColDef,
  GridRowModesModel,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Checkbox from "@mui/material/Checkbox";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPaginationModelSelector,
  gridRowCountSelector,
} from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Select, MenuItem, Typography } from "@mui/material";

import type { RootState } from "../store/store";

import { useSelector } from "react-redux";



// Define Task type (replace with actual Task model if needed)
interface Task {
  id: number;
  name: string;
  iscompleted: boolean;
}

interface TaskTableProps {
  onEdit: (id: number) => void;
  onReload: () => void;
  onCancelEdit: () => void;
}


function CustomPagination() {
  const apiRef = useGridApiContext();

  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const paginationModel = useGridSelector(apiRef, gridPaginationModelSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);

  const handlePageSizeChange = (event: any) => {
    apiRef.current.setPageSize(Number(event.target.value));
  };

  const { pageSize } = paginationModel;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, rowCount);

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.2} width="100%">
      <Typography fontSize={12}>Rows per page:</Typography>

      <Select
        size="small"
        value={paginationModel.pageSize}
        onChange={handlePageSizeChange}
      >
        {[5, 10, 25, 50].map((size) => (
          <MenuItem key={size} value={size}>{size}</MenuItem>
        ))}
      </Select>

      <Button onClick={() => apiRef.current.setPage(0)}>⏮</Button>

      <Button onClick={() => apiRef.current.setPage(Math.max(page - 1, 0))}>
        &lt;
      </Button>

      <span>
        {from}–{to} of {rowCount}
      </span>

      <Button onClick={() => apiRef.current.setPage(Math.min(page + 1, pageCount - 1))}>
        &gt;
      </Button>

      <Button onClick={() => apiRef.current.setPage(pageCount - 1)}>⏭</Button>
    </Box>
  );
}



const TaskTable: React.FC<TaskTableProps> = () => {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [confirmDelete, setConfirmDelete] = useState<Task | null>(null);

  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const DataGridIcon = useSelector(
        (state: RootState) => state.ui.DataGridIcon.color
    );

    const DataGridIconDelete = useSelector(
        (state: RootState) => state.ui.DataGridIconDelete.color
    );


  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 550, editable: true }, 
    {
        field: "iscompleted",
        headerName: "Completed",
        width: 120,
        align: "center",
        headerAlign: "center",
        editable: true, 
        renderCell: (params) => (
            <Checkbox checked={Boolean(params.value)} disabled />
        ),

        renderEditCell: (params) => (
            <Checkbox
                checked={Boolean(params.value)}
                onChange={(e) => {
                    params.api.setEditCellValue({
                    id: params.id,
                    field: params.field,
                    value: e.target.checked,
                    });
                }}
            />
        ),      
    },
        
    {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 180,
        getActions: (params) => {       
            const id = Number(params.id);
            const isInEditMode =
            rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem
                    icon={
                        <Tooltip title="Edit Save">
                            <SaveIcon />
                        </Tooltip>
                    }
                    label="Save"
                    onClick={() => handleSaveClick(params.id as number)}
                    />,
                    <GridActionsCellItem
                    icon={
                        <Tooltip title="Edit Cancel">
                            <CancelIcon />
                        </Tooltip>
                    }
                    label="Cancel"
                    onClick={() => handleCancelClick(params.id as number)}
                    />,
                ];
            }

            return [
            <GridActionsCellItem
                icon={
                <Tooltip title="Edit Record">
                    <EditIcon sx={{ color: DataGridIcon }}  />
                </Tooltip>
                }
                label="Edit"
                onClick={() => handleEditClick(params.id as number)}
            />,
            <GridActionsCellItem
                icon={
                <Tooltip title="Delete Record">
                    <DeleteIcon sx={{ color: DataGridIconDelete }} />
                </Tooltip>   
                }
                label="Delete"
                onClick={() => handleDeleteClick(params.row)}
            />,
            ];
        },
    }
   
  ];


    const processRowUpdate = async (newRow: any, oldRow: any) => {
        try {
            const payload = {
            name: newRow.name,
            iscompleted: Boolean(newRow.iscompleted),
            };

            const updated = await updateTask(newRow.id, payload);

            setTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
            );

            return updated;
        } catch (err) {
            console.error("Update failed", err);
            return oldRow;
        }
    };

 
    const handleDeleteClick = (task: Task) => {
        setConfirmDelete(task);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;

        await deleteTask(confirmDelete.id);
        setTasks((prev) => prev.filter(t => t.id !== confirmDelete.id));
        setConfirmDelete(null);

        // NOTE: getTasks() is redundant
        // getTasks()
        //     .then((data) => setTasks(data))
        //     .catch((err) => console.error("Failed to fetch tasks:", err));

    };

    const handleEditClick = (id: number) => {
        setRowModesModel((prev) => ({
            ...prev,
            [id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleSaveClick = (id: number) => {
        setRowModesModel((prev) => ({
            ...prev,
            [id]: { mode: GridRowModes.View },
        }));
    };

    const handleCancelClick = (id: number) => {
        setRowModesModel((prev) => ({
            ...prev,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        }));
    };


    // NEW
    useEffect(() => {
        getTasks()
            .then((data) => {

            console.log("TASKS RAW:", data);

            const list = Array.isArray(data) ? data : [];

            setTasks(list);
            })
            .catch((err) => console.error("Failed to fetch tasks:", err));
    }, []);

    // useEffect(() => {
    //     getTasks()
    //         .then((data) => {
    //         const safe = data.map((t: any) => ({
    //             id: t.id,
    //             name: t.name,
    //             iscompleted: t.iscompleted ?? false,
    //         }));

    //         setTasks(safe);
    //         })
    //         .catch((err) => console.error(err));
    // }, []);

    // OLD
    // useEffect(() => {
    //     // Fetch tasks from the backend (FastAPI)
    //     getTasks()
    //     .then((data) => setTasks(data))
    //     .catch((err) => console.error("Failed to fetch tasks:", err));
    // }, []);

  return (
    
    <div style={{ width: "1000px" }}>
             
              {/* rows={tasks} */}
        <DataGrid         
            rows={tasks.filter(t => t?.id != null)}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            processRowUpdate={processRowUpdate}
            className="standard-datagrid"
            disableRowSelectionOnClick 
            rowSelection={false}

            autoHeight

            columnVisibilityModel={{
                id: false,
            }}

            initialState={{
                pagination: {
                paginationModel: { pageSize: 10, page: 0 },
                },
                sorting: {
                sortModel: [{ field: "name", sort: "asc" }], // 👈 THIS
                },
            }}

            pageSizeOptions={[5, 10, 25, 50]}

            slots={{
                pagination: CustomPagination, // 👈 ADD THIS
            }}

        />

        {confirmDelete && (
            <CustomConfirm
                message={
                    <>
                        <div style={{ fontFamily: "Arial", fontSize: "12px" }}>
                        Task:{" "}
                        <strong style={{ color: "blue" }}>
                            {confirmDelete.name}
                        </strong>
                        </div>

                        <div
                        style={{
                            marginTop: "1em",
                            fontFamily: "Arial",
                            fontSize: "12px",
                        }}
                        >
                        Delete confirm?
                        </div>
                        <br />
                    </>
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        )}
    
    </div>
 
  );
};

export default TaskTable;