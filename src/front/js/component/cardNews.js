import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import TapNewsLogo from "../../../../public/tapnewslogo.png";
import "../../styles/card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShareFriend } from "./shareFriend";
import {
  faBookmark,
  faHeart,
  faComment,
  faShare,
  faPlay,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../store/AuthContext";

const CardNew = () => {
  const [description, setDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [show2, setShow2] = useState(false);
  const [urlshare, setUrlShare] = useState("");
  const [currentCommentNews, setCurrentCommentNews] = useState(null);
  const { store, actions } = useContext(Context);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});
  const { handleUserLogout, user } = useAuth();

  const visibility_description = () => {
    setDescription(!description);
  };

  const userId = localStorage.getItem("user_id");
  const user_likes = store.likes;
  const user_favorites = store.favouriteNews.map((news) => news.id);

  useEffect(() => {
    const checkAndLogout = async () => {
      if (!userId && user) {
        await handleUserLogout();
      }
    };
    checkAndLogout();
  }, [user]);

  const likeStyle = (id) => {
    return user_likes.includes(id)
      ? { color: "#FF0000" }
      : { color: "#FFFFFF" };
  };

  const bookmarkStyle = (id) => {
    return user_favorites.includes(id)
      ? { color: "#0044CC" }
      : { color: "#FFFFFF" };
  };

  useEffect(() => {
    if (localStorage.getItem("user_id")) {
      actions.getUserLikes();
      actions.getFavouriteNews();
    }
  }, [userId]);

  useEffect(() => {
    actions.getNews();
  }, []);

  const handleLike = (id) => {
    console.log(id);
    if (!user_likes.includes(id)) {
      actions.addLike(id);
    } else {
      actions.deleteLike(id);
    }
  };
  const handleCloseShow2 = () => setShow2(false);

  const handleShowShow2 = (url) => {
    setUrlShare(url);
    setShow2(true);
  };

  const handleBookmark = (id) => {
    if (!user_favorites.includes(id)) {
      actions.addFavouriteNew({ uuid: id });
    } else {
      actions.deleteFavouriteNew(id);
    }
  };

  const handleCommentClick = async (news) => {
    setCurrentCommentNews(news);
    setShowModal(true);
    // Obtener comentarios del backend si no están en el estado local
    if (!comments[news.uuid]) {
      try {
        const fetchedComments = await actions.getComments(news.uuid);
        setComments((prev) => ({
          ...prev,
          [news.uuid]: fetchedComments || [],
        }));
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCommentNews(null);
  };

  const handleSendComment = async () => {
    if (!comment) return; // No enviar comentarios vacíos

    const newsId = currentCommentNews.uuid;
    const userId = localStorage.getItem("user_id");

    console.log("Comentario enviado:", comment);

    const success = await actions.addComments(newsId, comment);

    if (success) {
        setComments((prev) => {
            console.log("Comentarios previos para esta noticia:", prev[newsId]);

            return {
                ...prev,
                [newsId]: [
                    ...(Array.isArray(prev[newsId]) ? prev[newsId] : []),
                    { content: comment, user_id: userId },
                ],
            };
        });

        setComment(""); // Limpiar el campo de texto
    } else {
        console.error("No se pudo agregar el comentario.");
    }
};
 
  

  if (!store.topnews || store.topnews.length === 0) {
    return (
      <div
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          right: "0",
          left: "0",
        }}
        className="loading"
      >
        <img className="logo-4" src={TapNewsLogo} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <div className="timeline" style={{ marginBlockEnd: "10%" }}>
        {store.topnews.map((singleNew, index) => (
          <Card
            className="Card-bg"
            key={index}
            style={{
              backgroundImage: `url(${singleNew.image_url})`,
              width: "100%",
              height: "55rem",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="actions d-flex flex-column"
              style={{
                background: description
                  ? "rgba(0, 43, 128, 1)"
                  : "rgba(0, 43, 128, 0.8)",
              }}
            >
              <FontAwesomeIcon
                onClick={() => handleLike(singleNew.uuid)}
                size="2xl"
                icon={faHeart}
                style={likeStyle(singleNew.uuid)}
                className="like p-2"
              />
              <FontAwesomeIcon
                onClick={() => handleBookmark(singleNew.uuid)}
                size="2xl"
                icon={faBookmark}
                style={bookmarkStyle(singleNew.uuid)}
                className="save p-2"
              />
              <FontAwesomeIcon
                size="2xl"
                icon={faComment}
                style={{ color: "#FFFFFF" }}
                className="comment p-2"
                onClick={() => handleCommentClick(singleNew)}
              />
              <FontAwesomeIcon
                size="2xl"
                onClick={() => handleShowShow2(singleNew.url)}
                icon={faShare}
                style={{ color: "#FFFFFF" }}
                className="share p-2"
              />
            </div>
            <Card.Body
              style={{
                backgroundColor: "#002B80",
                marginTop: description ? "150%" : "170%",
                mask: "linear-gradient( black 40%, transparent)",
              }}
              className="mycardbody"
            >
              <Card.Title
                className="title"
                style={{ color: "" }}
                onClick={visibility_description}
              >
                {singleNew.title}
              </Card.Title>
              <Card.Text
                className="description"
                style={{
                  visibility: description ? "visible" : "hidden",
                  color: "",
                }}
              >
                {singleNew.description}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Title className="title comments">
            <h1 className="text-center text-light mt-2">Comentarios:</h1>
          </Modal.Title>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "70vh",
              overflow: "hidden",
            }}
          >
            <Button
              variant="secondary"
              className="me-3"
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                right: "5px",
                top: "5px",
                padding: "0.5rem",
                height: "40px",
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Modal.Header
              className="text-light d-flex align-items-center justify-content-between"
              style={{
                flexShrink: 0,
              }}
            >
              {currentCommentNews ? (
                <div>
                  <h5>{currentCommentNews.title}</h5>
                </div>
              ) : (
                <p>Cargando datos...</p>
              )}
            </Modal.Header>
            <Modal.Body
              className="modal-body-scrollable-bool text-light"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1rem",
                paddingRight: "2rem",
              }}
            >
              {comments[currentCommentNews?.uuid]?.length > 0 ? (
                comments[currentCommentNews.uuid].map((comment, index) => (
                  <div key={index} className="comment">
                    <p>{comment.content}</p>
                  </div>
                ))
              ) : (
                <p>No hay comentarios aún.</p>
              )}
              {/* <p className="pb-1"></p> */}
              {/* {currentCommentNews && (
                <div className="comment container">
                  
                </div>
              )} */}
            </Modal.Body>
            <Modal.Footer
              className="footer text-light"
              style={{
                flexShrink: 0,
                borderTop: "1px solid #dee2e6",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <textarea
                  className="form-control text-light bg-info"
                  placeholder="Escribe tu comentario..."
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    width: "100%",
                    paddingRight: "4rem",
                    boxSizing: "border-box",
                  }}
                ></textarea>

                <Button
                  variant="primary"
                  onClick={handleSendComment}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    padding: "0.5rem 1rem",
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </Button>
              </div>
            </Modal.Footer>
          </div>
        </Modal>

        <Modal className="modalshare" show={show2} onHide={handleCloseShow2}>
          <Modal.Header className="">
            <Modal.Title>Compartir noticia</Modal.Title>
          </Modal.Header>
          <Modal.Body className="scrollable">
            <ShareFriend url={urlshare}></ShareFriend>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseShow2}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CardNew;
