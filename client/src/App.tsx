import { useEffect, useState } from "react";
import "./App.css";
import { Button, Layout, Select, Table, Tag } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";

export interface User {
  id: number;
  username: string;
  name: string;
  lastname: string;
  email: string;
  status: string;
  age: number;
}

const columns = [
  {
    title: "Usuario",
    dataIndex: "username",
    key: "username",
    width: "25%"
  },
  {
    title: "Nombre",
    dataIndex: "name",
    key: "name",
    width: "25%"
  },
  {
    title: "Apellido",
    dataIndex: "lastname",
    key: "lastname",
    width: "25%"
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render: (status: User["status"]) => {
      let color = "green";
      let estado = "Activo";
      if (status === "inactive") {
        color = "red";
        estado = "Inactivo";
      }
      return <Tag color={color}>{estado}</Tag>;
    },
    width: "10%"
  },
  {
    title: "Acciones",
    key: "actions",
    render: (user: User) => {
      console.log("action user", user);
      return (
        <>
          <Button type="link">Editar</Button>
          <Button type="link">Eliminar</Button>
        </>
      );
    },
    width: "15%"
  }
];

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    function fetchUsers() {
      fetch("http://localhost:4000/users")
        .then((res) => res.json())
        .then((users) => setUsers(users));
    }
    fetchUsers();
  }, []);

  if (users.length === 0) return <p>Loading...</p>;

  return (
    <>
      <Layout>
        <Header className="header">
          <img
            className="flexxusimg"
            src="../src/assets/Flexxus-Logo-Black-sidebar 1.png"
          />
        </Header>
        <Content className="content">
          <p className="title">
            Usuarios / <span>Listado de usuarios</span>
          </p>
          <div className="navbar">
            <div className="subnavbar">
              <Search
                className="search navbaritem"
                placeholder="Buscar usuarios"
                onSearch={() => {}}
                size="large"
              />
              <Select
                showSearch
                className="select navbaritem"
                placeholder="Filtrar por estado"
                options={[
                  {
                    value: "active",
                    label: "Activo"
                  },
                  {
                    value: "inactive",
                    label: "Inactivo"
                  }
                ]}
              />
            </div>
            <div>
              <Button className="adduser navbaritem" type="primary">
                Agregar usuario
              </Button>
            </div>
          </div>
          <Table className="table" dataSource={users} columns={columns}></Table>
        </Content>
      </Layout>
    </>
  );
}

export default App;
