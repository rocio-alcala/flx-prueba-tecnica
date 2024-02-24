import "./App.css";
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag
} from "antd";
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
  //TO-DO: crear memo que se actualice con el searchInput y filtro

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

  const renderUsers = useMemo(() => {
    if (users) {
      const statusFilter =
        selectedStatus && selectedStatus !== "all"
          ? users.filter((user) => user.status === selectedStatus)
          : users;
      const searchFilter = searchInput
        ? statusFilter.filter((user) =>
            `${user.name} ${user.lastname}`
              .toLocaleLowerCase()
              .includes(searchInput.toLocaleLowerCase())
          )
        : statusFilter;
      return searchFilter;
    }
  }, [users, selectedStatus, searchInput]);

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
          <Row>
            <Col>
              <Breadcrumb separator="/">
                <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
                <Breadcrumb.Item>Listado de usuarios</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
          <Flex justify="space-bet">
            <Space>
              <Search
                className="search navbaritem"
                placeholder="Buscar usuarios"
                width="50px"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
                size="large"
                style={{ width: 300 }}
              />
              <Select
                showSearch
                onChange={(e) => {
                  setSelectedStatus(e);
                }}
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
                  },
                  {
                    value: "all",
                    label: "Todos"
                  }
                ]}
              />
            </Space>
            <Button
              className="adduser navbaritem"
              type="primary"
              onClick={() => setIsCreateUserModalOpen(true)}
            >
              Agregar usuario
            </Button>
          </Flex>
          <Table
            className="table"
            dataSource={renderUsers}
            columns={columns}
            loading={isLoading}
            key={"id"}
          />
        </Content>
      </Layout>

      {/*       TO-DO AGREGAR COEMNTARIO */}
      {isCreateUserModalOpen && (
        <Modal
          onOk={() => setIsCreateUserModalOpen(false)}
          onCancel={() => setIsCreateUserModalOpen(false)}
          open
          title="Agregar usuario"
          footer={null}
          width={"572px"}
        >
          <Divider />
          <UserForm
            action="create"
            onSuccess={() => setIsCreateUserModalOpen(false)}
          />
        </Modal>
      )}

      {selectedUpdateUser && (
        <Modal
          onCancel={() => setSelectedUpdateUser(undefined)}
          open
          title="Editar usuario"
          footer={null}
          width={"572px"}
        >
          <Divider />
          <UserForm
            onSuccess={() => setSelectedUpdateUser(undefined)}
            action="update"
            selectedUser={selectedUpdateUser}
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
          onSuccess={() => setSelectedDeleteUser(undefined)}
          selectedUser={selectedDeleteUser}
        />
      </Modal>
    </>
  );
}

export default App;
