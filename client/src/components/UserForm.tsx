import { Button, Col, Divider, Form, Input, InputNumber, Row, Select, message } from "antd";
import { User } from "../App";
import {
  useCreateUserMutation,
  useUpdateUserByIdMutation
} from "../../store/api/usersApi";
import { v4 as uuidv4 } from "uuid";

interface UserFormPropsType {
  selectedUser?: User;
  action: string;
  onClose: () => void;
}

//el renderizado del form y la ejecucion de los funciones
//sera dinamico dependiendo del action recibido
export function UserForm({ selectedUser, onClose, action }: UserFormPropsType) {
  const [createUser, createResponse] = useCreateUserMutation();
  const [updateUser, updateResponse] = useUpdateUserByIdMutation();

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
      .finally(onClose);
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
      .finally(onClose);
  }

  const onFinish = (formValues: User) => {
    if (action === "create") {
      handleSuccessCreateUser(formValues);
    } else {
      if (!selectedUser) throw Error("Error seleccionando usuario a editar");
      handleSuccessUpdateUser(formValues);
    }
  };

  const onFinishFailed = (errorInfo: {
    values: User;
    errorFields: {
      name: (string | number)[];
      errors: string[];
    }[];
    outOfDate: boolean;
  }) => {
    console.error("Error de validacion en datos: ",errorInfo);
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
            required={false}
            style={{ fontWeight: "550" }}
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
            required={false}
            style={{ fontWeight: "550" }}
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
                message: "El nombre debe ser mayor a 2 caracteres"
              },
              {
                max: 12,
                message: "El nombre debe ser menor a 12 caracteres"
              }
            ]}
            required={false}
            style={{ fontWeight: "550" }}
          >
            <Input placeholder="Ingresa nombre" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Apellido"
            name="lastname"
            rules={[
              {
                required: true,
                message: "El apellido de usuario es requerido"
              },
              {
                min: 2,
                message: "El apellido debe ser mayor a 2 caracteres"
              },
              {
                max: 12,
                message: "El apellido debe ser menor a 12 caracteres"
              }
            ]}
            required={false}
            style={{ fontWeight: "550" }}
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
            required={false}
            style={{ fontWeight: "550" }}
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
                message: "Por favor ingrese la edad como numero"
              },
              {
                pattern: /^([0-9]|[1-8][0-9]|100)$/,
                message: "Por favor ingrese solo números entre 0 y 100"
              }
            ]}
            required={false}
            style={{ fontWeight: "550" }}
          >
            <InputNumber style={{width: "100%"}} placeholder="Ingresa edad" />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row justify="end">
        <Form.Item style={{ marginBottom: -4 }}>
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
