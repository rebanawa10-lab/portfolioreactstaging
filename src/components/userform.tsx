// file:    src/components/userform.tsx


import { useState, useEffect } from "react";
import { createUser, updateUser, getUserById } from "../api/userAPI";



interface Props {
  id?: number;
  onSuccess: () => void;
  // onCancel: () => void;
}



// , onCancel
export default function UserForm({ id, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(0);
  const [error, setError] = useState(""); // <-- new state for error message

  useEffect(() => {
    if (id) {
      getUserById(id).then((data) => {
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.is_admin);
      });
    } else {
      reset();
    }
  }, [id]);


  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);


  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setIsAdmin(0);
    setError(""); // clear error
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(""); // clear previous error

    if (!id && !password) {
      alert("Password is required for new users");
      return;
    }

    const payload: any = {
      name,
      email,
      is_admin: isAdmin,
    };

    if (password) {
      payload.password = password;
    }

    try {
        if (id) {
          await updateUser(id, payload);
        } else {
          await createUser(payload); // <-- backend may return 400 if duplicate
        }

        reset();
        onSuccess();
    } catch (err: any) {

        // NEW VER
         if (err.response?.data?.detail) {
            setError(err.response.data.detail);
          } else {
            setError("An unexpected error occurred");
          }

        // OLD VER
        // Check if backend sent a message
        // if (err.response && err.response.data && err.response.data.detail) {
        //     setError(err.response.data.detail); // <-- show duplicate email error
        // } else {
        //     setError("An unexpected error occurred");
        // }
    }

  };

  

  return (
    <form onSubmit={handleSubmit} className="form-horizontal" >
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={!id} // required only when creating new user
      />

      <select
        value={isAdmin}
        onChange={(e) => setIsAdmin(Number(e.target.value))}
      >
        <option value={0}>User</option>
        <option value={1}>Admin</option>
      </select>

      <button className="my-button" type="submit">
        Create
      </button>

      {error && <span className="errMsg">{error}</span>}

    <br></br><br></br><br></br>
    </form>
  );
}
