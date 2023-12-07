import { useEffect, useState, useContext, useCallback, useRef} from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import Context from '../../context';

const Detail = (props) => {
  const { toggleModal, isCloseHidden } = props;

  const [product, setProduct] = useState(null);

  const { cometChat, user, setIsLoading, selectedProduct, setSelectedProduct, setHasNewProduct } = useContext(Context);

  const history = useHistory();

  let loadProduct = null;
  let loadUserFollower = null;

  useEffect(() => {
    if (selectedProduct) {
      loadProduct();
    }
  }, [selectedProduct, loadProduct]);

  loadProduct = useCallback(async () => {
    if (!selectedProduct) {
      return;
    }
    try {
      setIsLoading(true);
      const { id } = selectedProduct;
      const url = `http://localhost:8080/products/${id}`;
      const response = await axios.get(url);
      if (response && response.data && response.data.message) {
        alert(response.data.message);
        setIsLoading(false);
        return;
      } else {
        setProduct(response.data[0]);
        await loadUserFollower();
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [setIsLoading, selectedProduct, loadUserFollower]);

  loadUserFollower = useCallback(async () => {
    const { id } = user;
    const { product_created_by } = selectedProduct;
    if (!id || !product_created_by) {
      return;
    }
    try {
      setIsLoading(true);
      const url = 'http://localhost:8080/followers/get';
      const response = await axios.post(url, { followerId: id, userId: product_created_by });
      setProduct(prevPost => ({ ...prevPost, hasFollowed: response && response.data && response.data.message ? false : true }));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [user, selectedProduct, setIsLoading]);

  const close = () => {
    setSelectedProduct(null);
    toggleModal(false);
  };

  const viewProfile = () => {
    if (!product.product_created_by) {
      return;
    }
    history.push(`/profile/${product.product_created_by}`);
  };

  const buyProduct = () => {
    if (!product.id) {
      return;
    }
    history.push(`/market/buy/${product.id}`);
  }

  const sendCustomMessage = ({ message, type, receiverId }) => {
    const receiverID = receiverId;
    const customType = type;
    const receiverType = cometChat.RECEIVER_TYPE.USER;
    const customData = { message };
    const customMessage = new cometChat.CustomMessage(receiverID, receiverType, customType, customData);

    cometChat.sendCustomMessage(customMessage).then(
      message => {
      },
      error => {
      }
    );
  };

  const removeFollow = async () => {
    const url = 'http://localhost:8080/followers/delete';
    return await axios.post(url, { followerId: user.id, userId: product.product_created_by });
  };

  const updateNumberOfFollowers = async (numberOfFollowers) => {
    const url = 'http://localhost:8080/users/followers';
    return await axios.post(url, { id: product.product_created_by, numberOfFollowers });
  };

  const follow = async () => {
    const url = 'http://localhost:8080/followers/create';
    return await axios.post(url, { followerId: user.id, userId: product.product_created_by });
  };

  const toggleFollow = async () => {
    try {
      if (product.hasFollowed) {
        await removeFollow();
        await updateNumberOfFollowers(product.user_number_of_followers ? product.user_number_of_followers - 1 : 0);
      } else {
        await follow();
        await updateNumberOfFollowers(product.user_number_of_followers ? product.user_number_of_followers + 1 : 1);
        const customMessage = { message: `${user.user_full_name} seguiu você`, type: 'notification', receiverId: product.product_created_by };
        sendCustomMessage(customMessage);
        await createNotification(customMessage.message);
      }
      await loadProduct();
    } catch (error) {

    }
  };

  const deleteproduct = async () => {
    const wantDelete = window.confirm('Deletar o product?');
    if (wantDelete) {
      const url = `http://localhost:8080/product/delete/${product.id}`;
      const response = await axios.post(url, {id: product.id});
      setSelectedProduct(null);
      toggleModal(false);
      setHasNewProduct(true);
    }
  }

  const createNotification = async (notificationMessage) => {
    const url = 'http://localhost:8080/notifications/create';
    return await axios.post(url, { notificationImage: user.user_avatar, notificationMessage, userId: product.product_created_by  });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`http:/localhost:3000/product/${selectedProduct.id}`);
    alert('Link copiado!');
  };

  return (
    <div className="post-detail">
      <div className="post-detail__content">
        <div className="post-detail__container">
          {!isCloseHidden && <div className="post-detail__close">
            <svg onClick={close} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>}
        </div>
        <div className="post-detail__main">
          <div className="post-detail__main-left">
            { product?.product_category === 1 &&
              <img src={`http://localhost:8080${product?.product_content}`} alt={`${product?.product_created_by} - ${product?.product_created_date}`}/>
            }
            { product?.product_category === 2 &&
              <video controls width="320" height="240">
                <source src={`http://localhost:8080${product?.product_content}`} type="video/mp4"></source>
              </video>
            }
          </div>
          <div className="post-detail__main-right">
            <div className="post-detail__creator">
              <img src={`http://localhost:8080${product?.user_avatar}`} alt={user.avatar} />
              <span className="post-detail__post-creator" onClick={viewProfile}>{product?.user_full_name}</span>
              {user.id !== product?.product_created_by && <div className="post-detail__dot"></div>}
              {user.id !== product?.product_created_by && <span className="post-detail__follow" onClick={toggleFollow}>{product?.hasFollowed ? 'Seguindo' : 'Seguir'}</span>}
              {user.id === product?.product_created_by && <span className="post-detail__delete" onClick={deleteproduct}><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></span>}
            </div>
            <div className="post-detail__description">
              <p>{product?.product_description}</p>
            </div>
            <div className="post-detail__product">
              <span className="post-detail__product-price">R$ {product?.product_price}</span>
              <span className="post-detail__product-buy" onClick={buyProduct}>Comprar</span> 
            </div>
            <div className="post-detail__reactions">
              <svg onClick={copyLink} aria-label="Compartilhar" className="_8-yf5 " color="#8e8e8e" fill="#8e8e8e" height="24" role="img" viewBox="0 0 48 48" width="24"><path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Detail;