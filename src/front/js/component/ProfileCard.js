import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Card, ListGroup, Form } from "react-bootstrap";
import "../../styles/profilecard.css";
import TapNewsLogo from '/workspaces/sp78-Final-Project-TapNews/public/1729329195515-removebg-preview.png';
import { useAuth }  from  '../store/AuthContext.js'
import {Storage, ID} from "appwrite";
import client, { PROYECT_ID, STORAGE_ID} from "/workspaces/sp78-Final-Project-TapNews/src/appwriteConfig.js";
const ProfileCard = () => {
 
  const storage = new Storage(client);

  const { store, actions } = useContext(Context);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [description, setDescription] = useState(store.profile?.description || "");
  const [imageUrl, setImageUrl] = useState(store.profile?.img_url || "");
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const { handleUserLogout } = useAuth();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const openModal2 = () => setShowModal2(true);
  const closeModal2 = () => setShowModal2(false);

  useEffect(() => {
    if (userId) {
      actions.getProfile(userId);
      actions.getUser(userId);
      actions.getFriends(userId);
    } else {
      navigate("/login"); 
    }
  }, [userId, navigate]);

 
  useEffect(() => {
    if (store.profile && store.profile.img_url) {
      setImageUrl(store.profile.img_url); 
    }
  }, [store.profile]);

  useEffect(() => {
    const fileInput = document.getElementById('uploader');

    if (fileInput) {
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const response = await storage.createFile(
              STORAGE_ID, 
              ID.unique(),  
              file  
            );

            console.log('Archivo subido con éxito:', response);

            if (response && response.$id) {
              const fileId = response.$id;
              console.log("File ID:", fileId);

              const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${STORAGE_ID}/files/${fileId}/view?project=${PROYECT_ID}`;

              setImageUrl(imageUrl);

              console.log('URL del archivo:', imageUrl);
              const updatedProfile = {
                description,
                image_url: imageUrl,
              };
              await actions.modifyProfile(userId, updatedProfile);
            } else {
              console.error('Error: El archivo subido no tiene un ID válido:', response);
            }
          } catch (error) {
            console.error('Error al subir el archivo o al obtener la URL:', error);
          }
        } else {
          console.log("No file selected.");
        }
      };

      fileInput.addEventListener('change', handleFileChange);

      return () => {
        fileInput.removeEventListener('change', handleFileChange);
      };
    }
  }, [storage]);

  
  const handleLogout = () => {
    actions.logout();
    handleUserLogout();
    closeModal2();
  };

  const handleSaveChanges = async () => {
    const updatedProfile = {
      description,
      image_url: imageUrl, 
    };
    await actions.modifyProfile(userId, updatedProfile);
    setShowModal(false); 
  };

  if (!store.user || !store.profile || !store.friends || !store.user.username) {
    return (
     <div style={{position: 'absolute', top: '0', bottom:'0', right:'0', left: '0'}} className="loading">
        <img className="logo-3" src={TapNewsLogo} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Card style={{ width: '100%', backgroundColor: '#0044CC' }}>
        <Card.Img
          className="mx-auto m-4 profileimage"
          variant="top"
          src={imageUrl || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg'}
        />
        <Card.Body>
          <Card.Title className="text-center username">{store.user.username}</Card.Title>
          <Card.Text className="text-center description">{store.profile.description}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroup.Item className="text-center">
            Amistades - {store.friends && store.friends.length ? store.friends.length : "0"}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-center">
            <Button className="editprofile" onClick={openModal}>Editar perfil</Button>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-center">
            <Button className="logoutbutton" onClick={openModal2}>Cerrar sesión</Button>
          </ListGroup.Item>
          <ListGroup.Item className="text-center gridtitle">Noticias guardadas</ListGroup.Item>
        </ListGroup>
      </Card>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title className="modaltitle">Editar perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="form-bg">
          <Form>
            <Form.Group className="mb-3" controlId="imageUrl">
              <Form.Label className="label">Imagen de perfil</Form.Label>
              <input type="file" id="uploader" accept="image/*" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label className="label">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="close" onClick={closeModal}>Cerrar</Button>
          <Button className="savechanges" onClick={handleSaveChanges}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal2} onHide={closeModal2} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="title-logout">Cierre de sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-logout">¿Seguro que quieres cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal2}>Cerrar</Button>
          <Link to="/login">
            <Button className="reallogout" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { ProfileCard };
