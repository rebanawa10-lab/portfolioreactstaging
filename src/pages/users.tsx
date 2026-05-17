// file:    src/pages/users.tsx


import UserTable from "../components/usertableGRID"; 
import UserForm from "../components/userform"; 
import { useState } from "react";
import TooltipWrapper from "../components/customTooltipWrapper";  

export default function UsersPage() {
  const [reload, setReload] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();

  const handleSuccess = () => {
    setReload((prev) => !prev);
    setEditingId(undefined);
  };

  return (
    <>
      <h2>CRUD Users List</h2>

      <TooltipWrapper
        title={
          <>
            - This module allowed only the [Admin] and [SuperAdmin] to operate.<br />
            - New user require Name / Email / Password / User Type.<br />
            - Click the Row header to sort or filter the data.<br />
            - Note: Duplicate email is not allowed<br />
            - Note: Blank password is not allowed
          </>
        }
        maxWidth={500}
      >
        <span className="my-cell">
          &nbsp;&nbsp;&nbsp;*&nbsp;&nbsp; Overview
        </span>
      </TooltipWrapper>

      <br></br><br></br>
      <UserForm
        id={editingId}
        onSuccess={handleSuccess}
      />
      {/* <UserForm
        id={editingId}
        onSuccess={() => {
          setReload(!reload);
          setEditingId(undefined);
        }}
        onCancel={() => setEditingId(undefined)}
      /> */}

      <UserTable
        key={reload.toString()}
        onEdit={(id) => setEditingId(id)}
        onReload={() => setReload(!reload)}
        onCancelEdit={() => setEditingId(undefined)}
      />
    </>
  );
}
