import { Button, Col, Divider, Row, Space, message } from "antd";
import { useDeleteUserByIdMutation } from "../../store/api/usersApi";
import { User } from "../App";

interface CheckDeletePropsType {
  onClose: () => void;
  selectedUser?: User;
}

export default function ConfirmDelete({
  onClose,
  selectedUser
}: CheckDeletePropsType) {
  const [deleteUser] = useDeleteUserByIdMutation();

  function handleDeleteClick() {
    if (!selectedUser) throw Error("Error seleccionando usuario a eliminar");
    deleteUser(selectedUser.id)
      .unwrap()
      .then(() => {
        message.success(
          `Eliminaste correctamente el usuario @${selectedUser.username}`
        );
      })
      .catch((error) => {
        message.error(`Hubo un problema elimiando usuario`);
        console.error(`Hubo un problema elimiando usuario: ${error}`);
      })
      .finally(onClose);
  }

  return (
    <>
      <Divider />
      <p>
        ¿Está seguro que desea eliminar el usuario{" "}
        <span style={{ color: "red" }}>@{selectedUser?.username}</span>?
      </p>
      <Divider />
      <Row justify="end">
        <Col>
          <Space>
            <Button key="cancel" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              key="delete"
              type="primary"
              danger
              onClick={handleDeleteClick}
            >
              Eliminar
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
}
