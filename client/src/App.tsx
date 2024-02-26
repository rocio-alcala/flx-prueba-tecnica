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
        const color = status === "active" ? "green" : "red";
        const text = status === "active" ? "Activo" : "Inactivo";

        return <Tag color={color}>{text}</Tag>;
      },
      width: "10%"
    },
    {
      title: "Acciones",
      key: "actions",
      render: (user: User) => {
        return (
          <>
            <Button onClick={() => setSelectedUpdateUser(user)} type="link">
              Editar
            </Button>
            <Button onClick={() => setSelectedDeleteUser(user)} type="link">
              Eliminar
            </Button>
          </>
        );
      },
      width: "15%"
    }
  ];

  if (fetchError) {
    console.error("@Error al cargar usuarios:", fetchError);
    message.error("Error al cargar usuarios");
  }

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ backgroundColor: "#d9d9d9", height: "fit-content" }}>
          <Flex>
            <img
              style={{ padding: "30px" }}
              src="../src/assets/flexxus_logo.png"
            />
          </Flex>
        </Header>
        <Content style={{ padding: "20px", margin: "0px 100px" }}>
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
              style={{ height: "40px", fontSize: "15px" }}
              type="primary"
              onClick={() => setIsCreateUserModalOpen(true)}
            >
              Agregar usuario
            </Button>
          </Flex>
          <Table
            rowKey="id"
            className="table"
            dataSource={users}
            columns={columns}
            loading={isLoading}
            pagination={false}
          />
          <Pagination
            style={{ textAlign: "right", margin: "30px" }}
            current={currentPage + 1}
            pageSize={PAGE_COUNT}
            total={totalset}
            onChange={(current) => setCurrentPage(current - 1)}
            showLessItems
          />
        </Content>
      </Layout>

      {/* MODALS FUERA DE LAYOUT YA QUE NO SIEMPRE SE RENDERIZARAN
      SE APLICO RENDERIZADO CONDICIONAL PARA QUE SE PRODUZCA EL DESMONTADO DEL COMPONENTE
      Y ASI SE ACTUALICEN LOS DATOS EN FORM */}
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
            onClose={() => setIsCreateUserModalOpen(false)}
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
            onClose={() => setSelectedUpdateUser(undefined)}
            action="update"
            selectedUser={selectedUpdateUser}
          />
        </Modal>
      )}

      <Modal
        onCancel={() => setSelectedDeleteUser(undefined)}
        open={Boolean(selectedDeleteUser)}
        title="Eliminar usuario"
        footer={null}
      >
        <ConfirmDelete
          onClose={() => setSelectedDeleteUser(undefined)}
          selectedUser={selectedDeleteUser}
        />
      </Modal>
    </>
  );
}

export default App;
