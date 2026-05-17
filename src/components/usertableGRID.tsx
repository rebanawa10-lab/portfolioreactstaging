// file: src/components/usertableGRID.tsx


import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../api/userAPI";
import type { User } from "../types/user";
import CustomConfirm from "./customYN";

import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";

import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPaginationModelSelector,
  gridRowCountSelector,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Select, MenuItem, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import type {
  GridColDef,
  GridRowModesModel,
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import LockResetIcon from "@mui/icons-material/LockReset";

import Tooltip from "@mui/material/Tooltip";

import { log } from "../config/debug";


    // props: any
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
    <Box display="flex" alignItems="center" 
      justifyContent="flex-end"
      gap={0.2}
      width="100%" 
    >
      <Typography fontSize={12} sx={{ mr: 1 }}>
        Rows per page:
      </Typography>

      <Select
        size="small"
        value={paginationModel.pageSize}
        onChange={handlePageSizeChange}
        sx={{ fontSize: 12, height: 28 }}
      >
        {[5, 10, 25, 50].map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>

      {/* FIRST */}
      <Button 
        size="small" 
        sx={{ minWidth: "auto", px: 1 }}
        onClick={() => apiRef.current.setPage(0)}
        disabled={page === 0}>
        ⏮
      </Button>


      {/* PREV */}
      <Button
        size="small"
        sx={{ minWidth: "auto", px: 1 }}
        
        onClick={() => apiRef.current.setPage(Math.max(page - 1, 0))}
        disabled={page === 0}
      >
        &lt;
      </Button>


      {/* Range text */}
      <span style={{ fontSize: "12px", margin: "0 3px", whiteSpace: "nowrap" }}>
        {from}–{to} of {rowCount}
      </span>


      {/* NEXT */}
      <Button
        size="small"
        sx={{ minWidth: "auto", px: 1 }}     
        onClick={() =>  apiRef.current.setPage(Math.min(page + 1, pageCount - 1))}
        disabled={page >= pageCount - 1}
      >
        &gt;
      </Button>

     
      {/* LAST */}
      <Button
        size="small"
        sx={{ minWidth: "auto", px: 1 }}
        onClick={() => apiRef.current.setPage(pageCount - 1)} 
        disabled={page === pageCount - 1}
      >
      ⏭
      </Button> 
    </Box>
  );
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const [confirmPassword, setConfirmPassword] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorModal, setErrorModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { is_admin } = useSelector(
    (state: RootState) => state.user
  );


  // ✅ ADD IT HERE
   // ---------------------------------------------------------------------------------------- 
  // const handleAddUser = async (newUser: Partial<User>) => {
  //     try {
  //       setLoading(true);

  //       const created = await createUser(newUser);

  //       setUsers((prev) => [...prev, created]);
  //     } catch (error: any) {
  //       console.error(
  //         "CREATE ERROR:",
  //         error?.response?.data || error
  //       );
  //       setErrorModal("Unable to add user.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // OLD
  //   // const { is_admin } = useSelector((state: RootState) => state.user);
  //   // NEW 
  //   const { is_admin } = useSelector(
  //     (state: RootState) => state.user
  //   );



  //   useEffect(() => {
  //     const adminLevel = Number(is_admin);

  //     if (adminLevel > 0) {
  //       loadUsers();
  //     }
  //   }, [is_admin]);

  //   ...
  // }
  // ----------------------------------------------------------------------------------------

  useEffect(() => {
      const adminLevel = Number(is_admin);

      log("DEBUG is_admin:", is_admin, "normalized:", adminLevel);

      if (adminLevel > 0) {
        loadUsers();
      }

      //  if (Number(is_admin) === 1) {
      //   loadUsers();
      // }
      // loadUsers();
  }, [is_admin]);

  useEffect(() => {
  if (!errorModal) return;

  const timer = setTimeout(() => {
      setErrorModal(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorModal]);

  
    const DataGridIcon = useSelector(
        (state: RootState) => state.ui.DataGridIcon.color
    );

    const DataGridIconDelete = useSelector(
            (state: RootState) => state.ui.DataGridIconDelete.color
    );

  // VER2
  // const loadUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getUsers();
  //       log("🔥 RAW USERS1:", data);

  //       const normalized = data.map((u) => ({
  //         ...u,
  //         is_admin: Number(u.is_admin ?? 0),
  //       }));

  //       // DEBUG 
  //       log("🔥 RAW USERS2:", data);

  //       // ORIG 
  //       setUsers(normalized);

  //       // DEBUG 
  //       const token = localStorage.getItem("token");
  //       if (token) {
  //         const payload = JSON.parse(atob(token.split(".")[1]));
  //         log("🔥 TOKEN PAYLOAD:", payload);
  //         log("👉 is_admin:", payload.is_admin);
  //         log("👉 is_level:", payload.is_level);
  //       }

        

  //     } catch (err: any) {
  //       console.error("getUsers failed:", err?.response?.data);

  //       setErrorModal(
  //         err?.response?.data?.detail || "Failed to load users (403?)"
  //       );

  //       setUsers([]); // important
  //     } finally {
  //       setLoading(false);
  //     }
  // };

  // VER3
  // 202604 13  Test
  const loadUsers = async () => {
    try {
        setLoading(true);

        const data = await getUsers();

        // DEBUG MODE: CRUD Users list, list data in array
        // log("🔥 FRONTEND RAW DATA:", data);
        // log("TYPE:", typeof data);
        // log("IS ARRAY:", Array.isArray(data));

        setUsers(data);
    } catch (err: any) {
        console.error("❌ LOAD USERS ERROR:", err);
    } finally {
        setLoading(false);
    }
  };

  const handleSuccess = () => {
    setEditingId(undefined);
    // loadUsers(); // refresh table after create/update
  };

  // 202604 13 Not working 
  // const loadUsers = async () => {
  //     try {
  //       log("🔑 TOKEN BEFORE CALL:", localStorage.getItem("token"));

  //       const data = await getUsers();

  //       log("🔥 USERS RESPONSE:", data);

  //       // setUsers(data);

  //     } catch (err: any) {

  //       console.error("❌ LOAD USERS FAILED:", err?.response?.data || err);
  //       setErrorModal(err?.message || "API failed");

  //     }
  // };

  // VER1
  // const loadUsers = async () => {
  //   const data = await getUsers();
  //   const normalized = data.map((u) => ({
  //     ...u,
  //     is_admin: u.is_admin !== undefined ? Number(u.is_admin) : 0,
  //   }));
  //   log("🔥 RAW USERS:", data);
  //   setUsers(normalized);
  // };

  // =========================
  // 🔥 EDIT HANDLERS (DATAGRID)
  // =========================

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

  const processRowUpdate = async (newRow: any, oldRow: any) => {
    const payload: any = {
      name: newRow.name,
      email: newRow.email,
      is_admin: Number(newRow.is_admin) > 0 ? 1 : 0,
    };

    try {
      setLoading(true);

      log("🔥 CLEAN UPDATE PAYLOAD:", payload);

      const updated = await updateUser(newRow.id, payload);

      return updated;
    } catch (err: any) {
      console.error("❌ UPDATE FAILED:", err?.response?.data);
      setErrorModal(err?.response?.data?.detail || "Update failed");
      return oldRow;
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // 🔥 DELETE
  // =========================

  const handleDeleteClick = (user: User) => {
    setConfirmDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    await deleteUser(confirmDelete.id);
    setConfirmDelete(null);
    loadUsers();
  };

  // =========================
  // 🔥 PASSWORD
  // =========================

  const handlePasswordClick = (user: User) => {
    setConfirmPassword(user);
    setNewPassword("");
    setShowPassword(false);
  };

  const handleConfirmPassword = async () => {
    if (!confirmPassword) return;

    if (!newPassword) {
      setErrorModal("Password cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await updateUser(confirmPassword.id, { password: newPassword });

      setConfirmPassword(null);
      setNewPassword("");
    } catch (err: any) {
      setErrorModal(err?.response?.data?.detail || "Password update failed");
    } finally {
      setLoading(false);
    }
  };



  localStorage.getItem("token")

  // const handleAddUser = async (newUser: Partial<User>) => {
  //   try {
  //     setLoading(true);

  //     const created = await createUser(newUser);

  //     setUsers((prev) => [...prev, created]);
  //   } catch (error: any) {
  //     console.error("CREATE ERROR:", error?.response?.data || error);
  //     setErrorModal("Unable to add user.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // export const createUser = async (data: Partial<User>) => {
  //   try {
  //     const res = await axios.post(
  //       `${API_URL}/users/`,
  //       data,
  //       authHeaders()
  //     );

  //     return res.data;
  //   } catch (err: any) {
  //     console.error("CREATE ERROR");
  //     console.error("STATUS:", err?.response?.status);
  //     console.error("DATA:", err?.response?.data);
  //     throw err;
  //   }
  // };

  // =========================
  // 🔥 COLUMNS
  // =========================

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },

    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: true,
    },

    {
      field: "email",
      headerName: "Email",
      width: 350,
      editable: true,
    },

    {
      field: "is_admin",
      headerName: "Admin",
      width: 120,
      type: "singleSelect",
      valueOptions: [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
       
      ],
      valueGetter: (value) => (Number(value) > 0 ? 1 : 0),

      valueFormatter: (value) => (Number(value) > 0 ? "Yes" : "No"),
      editable: true,
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 180,
      getActions: (params) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              // icon={<SaveIcon />}
              icon={
                <Tooltip title="Edit Save">
                  <SaveIcon />
                </Tooltip>
              }
              label="Save"
              onClick={() => handleSaveClick(params.id as number)}
            />,
            <GridActionsCellItem
              // icon={<CancelIcon />}
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
                <DeleteIcon sx={{ color: DataGridIconDelete }}  />
              </Tooltip>
            }
            label="Delete"
            onClick={() => handleDeleteClick(params.row)}
          />,
          <GridActionsCellItem
            icon={
              <Tooltip title="Change Password">
                <LockResetIcon sx={{ color: DataGridIcon }}  />
              </Tooltip>
            }
            label="Password"
            onClick={() => handlePasswordClick(params.row)}
          />,
        ];
      },
    },
  ];



 


  return (
    <div style={{ width: "1000px" }}>
      
       {/* rows={users} */}
      <DataGrid
        className="standard-datagrid"
        rows={Array.isArray(users) ? users : []}
        columns={columns}
        loading={loading}
       
        getRowId={(row) => row.id}
        disableRowSelectionOnClick 
        rowSelection={false}

        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}

        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
  
        autoHeight

        columnVisibilityModel={{
          id: false,
        }}

       
        slots={{
          pagination: CustomPagination,
        }}


      />

      {/* DELETE MODAL */}
      {confirmDelete && (
        <CustomConfirm
          message={
            <>
              <div style={{ fontFamily: "Arial", fontSize: "12px" }}>
                  User:{" "}<strong style={{ color: "blue" }}>{confirmDelete.name}</strong>              
              </div>
              <div style={{ marginTop: "1em", fontFamily: "Arial", fontSize: "12px" }}>Delete confirm?</div><br></br>
            </>
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* PASSWORD MODAL */}
      {confirmPassword && (
        <CustomConfirm
          message={
            <>
              <div style={{ fontFamily: "Arial", fontSize: "12px" }}>           
                  User:{" "}<strong style={{ color: "blue" }}>{confirmPassword.name}</strong>
              </div>

              <div style={{ marginTop: "1em", fontFamily: "Arial", fontSize: "12px" }}>
                Enter new password:
              </div>

              <div style={{ marginTop: "0.5em", position: "relative" , fontFamily: "Arial", fontSize: "12px"}}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    style={{ width: "140px", paddingRight: "40px" }}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                    <span
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        userSelect: "none",
                        fontSize: "14px"
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
            
              </div><br></br>
            </>
          }
          onConfirm={handleConfirmPassword}
          onCancel={() => setConfirmPassword(null)}
        />
      )}

      {/* ERROR MODAL */}
      {errorModal && (
        <CustomConfirm
          message={<div className="errMsg">❌ {errorModal}</div>}
          onConfirm={() => setErrorModal(null)}
          singleButton
        />
      )}
    </div>
  );
}