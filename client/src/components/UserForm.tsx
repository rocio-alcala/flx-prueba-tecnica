import { Button, Col, Divider, Form, Input, Row, Select, message } from "antd";
import { User } from "../App";
import {
  useCreateUserMutation,
  useUpdateUserByIdMutation
} from "../../store/api/usersApi";
import { v4 as uuidv4 } from "uuid";

interface UserFormPropsType {
  selectedUser?: User;
  action: string;
  clearModal: React.Dispatch<React.SetStateAction<User | undefined>> | React.Dispatch<React.SetStateAction<boolean>>
}

export function UserForm({
  selectedUser,
  clearModal,
  action
}: UserFormPropsType) {
  const [createUser, createResponse] = useCreateUserMutation();
  const [updateUser, updateResponse] = useUpdateUserByIdMutation();

  console.log("@usuario que llega al form", selectedUser);

  function handleSuccessCreateUser(formValues: Omit<User, "id">) {
    const newUser: User = { id: uuidv4(), ...formValues };
    createUser(newUser)
      .unwrap()
      .then((user) => {
        message.success(`Agregaste correctamente el usuario @${user.username}`);
      })
      .catch((error) => {
        message.error(`Hubo un problema agregando el usuario`);
        console.error(`Error agregando el usuario: ${error}`);
      })
      .finally(() => clearModal(false));
  }

  function handleSuccessUpdateUser(formValues: Omit<User, "id">) {
    if (!selectedUser) throw Error("Error seleccionando usuario a editar");
    const newUser: User = { id: selectedUser.id, ...formValues };
    updateUser(newUser)
      .unwrap()
      .then((user) => {
        message.success(`Editaste correctamente el usuario @${user.username}`);
      })
      .catch((error) => {
        message.error(`Hubo un problema editando el usuario`);
        console.error(`Error editando el usuario: ${error}`);
      })
      .finally(() => clearModal(undefined));
  }

  const onFinish = (formValues: User) => {
    console.log("@values enviados en el form", formValues);
    if (action === "create") {
      handleSuccessCreateUser(formValues);
    } else {
      if (!selectedUser) throw Error("Error seleccionando usuario a editar");
      handleSuccessUpdateUser(formValues);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error(errorInfo);
    message.info("Ocurrio un error al enviar los datos");
  };

  return (
    <Form
      name="userForm"
      labelCol={{ span: 22 }}
      wrapperCol={{ span: 30 }}
      initialValues={selectedUser}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Usuario"
            name="username"
            rules={[
              { required: true, message: "El nombre de usuario es requerido" },
              {
                min: 2,
                message: "El nombre usuario debe ser mayor a 2 caracteres"
              },
              {
                max: 12,
                message: "El nombre usuario debe ser menor a 12 caracteres"
              }
            ]}
          >
            <Input placeholder="Ingresa usuario" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Por favor ingresa un email" },
              {
                type: "email",
                message: "Por favor ingrese un correo electrónico válido"
              }
            ]}
          >
            <Input placeholder="Ingresa email" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: "El nombre de usuario es requerido" },
              {
                min: 2,
                message: "El nombre usuario debe ser mayor a 2 caracteres"
              },
              {
                max: 12,
                message: "El nombre usuario debe ser menor a 12 caracteres"
              }
            ]}
          >
            <Input placeholder="Ingresa nombre" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Apellido"
            name="lastname"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input placeholder="Ingresa apellido" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Estado"
            name="status"
            rules={[{ required: true, message: "Por favor ingresa un estado" }]}
          >
            <Select
              placeholder="Seleccione un estado"
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
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Edad"
            name="age"
            rules={[
              {
                required: true,
                message: "Por favor ingrese la edad"
              },
              {
                pattern: /^[0-9]+$/,
                message: "Por favor ingrese solo números"
              }
            ]}
          >
            <Input placeholder="Ingresa edad" />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row justify="end">
        <Form.Item
          style={{ textAlign: "right", marginBottom: -4, marginRight: -4 }}
        >
          <Button
            type="primary"
            htmlType="submit"
            loading={
              action === "create"
                ? createResponse.isLoading
                : updateResponse.isLoading
            }
          >
            {action === "create" ? "Agregar usuario" : "Editar usuario"}
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
}
