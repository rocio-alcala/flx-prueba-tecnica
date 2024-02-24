import "./App.css";
import { Button, Divider, Layout, Modal, Select, Table, Tag } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import { useGetUsersQuery } from "../store/api/usersApi";
import { useMemo, useState } from "react";
import { UserForm } from "./components/UserForm";
import CheckDelete from "./components/CheckDelete";

export interface User {
  id: number | string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  status: string;
  age: number;
}

function App() {
  const { data: users, isLoading } = useGetUsersQuery();
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User>();
  const [selectedUpdateUser, setSelectedUpdateUser] = useState<User>();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();

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
        return (
          <>
            <Button
              onClick={() => {
                console.log("user seleccionado", user);
                setSelectedUpdateUser(user);
              }}
              type="link"
            >
              Editar
            </Button>
            <Button
              onClick={() => {
                setSelectedDeleteUser(user);
              }}
              type="link"
            >
              Eliminar
            </Button>
          </>
        );
      },
      width: "15%"
    }
  ];



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
                value={searchInput}
                onSearch={(e) => {
                  setSearchInput(e);
                }}
                size="large"
              />
              <Select
                showSearch
                onChange={(e) => {
                  setSelectedStatus(e);
                }}
                value={selectedStatus}
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
              <Button
                className="adduser navbaritem"
                type="primary"
                onClick={() => setIsCreateUserModalOpen(true)}
              >
                Agregar usuario
              </Button>
            </div>
          </div>
          <Table
            className="table"
            dataSource={users}
            columns={columns}
            loading={isLoading}
          />
        </Content>
      </Layout>
      <Modal
        onOk={() => setIsCreateUserModalOpen(false)}
        onCancel={() => setIsCreateUserModalOpen(false)}
        open={isCreateUserModalOpen}
        title="Agregar usuario"
        footer={null}
        width={"572px"}
      >
        <Divider />
        <UserForm action="create" clearModal={setIsCreateUserModalOpen} />
      </Modal>

      {selectedUpdateUser && (
        <Modal
          onCancel={() => setSelectedUpdateUser(undefined)}
          open={!!selectedUpdateUser}
          title="Editar usuario"
          footer={null}
          width={"572px"}
        >
          <Divider />
          <UserForm
            action="update"
            selectedUser={selectedUpdateUser}
            clearModal={setSelectedUpdateUser}
          />
        </Modal>
      )}
      <Modal
        onCancel={() => setSelectedDeleteUser(undefined)}
        open={!!selectedDeleteUser}
        title="Eliminar usuario"
        footer={null}
      >
        <CheckDelete
          clearUser={setSelectedDeleteUser}
          selectedUser={selectedDeleteUser}
        />
      </Modal>
    </>
  );
}

export default App;
