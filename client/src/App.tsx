import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Flex,
  Layout,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
  message
} from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Search from "antd/es/input/Search";
import { useGetUsersQuery } from "../store/api/usersApi";
import { useState } from "react";
import { UserForm } from "./components/UserForm";
import ConfirmDelete from "./components/ConfirmDelete";

export interface User {
  id: number | string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  status: string;
  age: number;
}

const PAGE_COUNT = 9;

function App() {
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User>();
  const [selectedUpdateUser, setSelectedUpdateUser] = useState<User>();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();
  const {
    data: { dataset: users, totalset } = {},
    isLoading,
    error: fetchError
  } = useGetUsersQuery({
    // se envian los params en la request para que la api json server realice el filtrado
    _limit: PAGE_COUNT, //nos devuelve un limite de usuarios
    _start: currentPage * PAGE_COUNT, //nos devuelve los usuarios apartir de nuestro offset
    name_like: searchInput, //devuelve usuarios que coincidan name y searchInput
    status: selectedStatus || undefined // devuelve usuarios con status igual a selectedStatus
    //si es una "" (falsy) no se pasa status param
  });


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
          <Flex
            style={{ fontSize: "15px", padding: "20px 0px" }}
            gap={40}
            justify="space-between"
          >
            <Space>
              <Search
                style={{ height: "40px", fontSize: "15px", width: "400px" }}
                placeholder="Buscar usuarios por nombre"
                onChange={(e) => {
                  //para no realizar una llamada a la API en cada change
                  //se podria setear el input en el onSearch
                  setSearchInput(e.target.value);
                  setCurrentPage(0); // resetea paginacion a pagina 1 (0) en cada busqueda
                }}
                size="large"
              />
              <Select
                style={{
                  height: "40px",
                  fontSize: "15px",
                  margin: "0px 15px",
                  width: "250px"
                }}
                showSearch
                onChange={(e) => {
                  setSelectedStatus(e);
                  setCurrentPage(0); // resetea paginacion a pagina 1 (0) en cada cambio
                }}
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
                    value: "",
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
