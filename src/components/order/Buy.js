import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Header from "../common/Header";
import SideBar from '../common/SideBar';
import Context from '../../context';
import axios from "axios";
import ProductDetail from "./ProductDetail";
import SweetAlert from 'sweetalert2-react16';
import 'sweetalert2/dist/sweetalert2.css';
import { useHistory } from "react-router";

const Buy = (props) => {
	const params = props.match.params;

	const [orderProduct, setOrderProduct] = useState(null);

	const {user, setIsLoading} = useContext(Context);

	const [paymentMethod, setPaymentMethod] = useState(null);

	const [loadingShow, setLoadingShow] = useState(false);

	const [orderResultId, setOrderResultId] = useState(false);

	const history = useHistory();

	let deliveryNameRef = useRef(null);
	let deliveryEmailRef = useRef(null);
	let additionalInfoRef = useRef(null);

	let loadOrderProduct = null;

	useEffect(() => {
		loadOrderProduct();
	}, [loadOrderProduct]);

	loadOrderProduct = useCallback(async () => {
		const orderProductId = params.id;
		if (!orderProductId) {
			return;
		}
		try {
			setIsLoading(true);
			const url = `http://localhost:8080/products/${orderProductId}`;
			const response = await axios.get(url);
			if (response && response.data && response.data.message) {
				alert(response.data.message);
				setIsLoading(false);
				return;
			} else {
				setOrderProduct(response.data[0]);
				setIsLoading(false);
			}
		} catch (error) {
			setIsLoading(false);
		}
	}, [setIsLoading, params]);

	const sendOrder = async () => {
		setLoadingShow(true);
		const sellerId = orderProduct.product_created_by;
		const customerId = user.id;
		const productId = orderProduct.id;
		const productPrice = orderProduct.product_price;
		const deliveryName = deliveryNameRef.current.value;
		const deliveryEmail = deliveryEmailRef.current.value;
		const additionalInfo = additionalInfoRef.current.value;
		const paymentMethodInfo = paymentMethod ? paymentMethod : 'cartao';
		try {
			setIsLoading(true);
		  const orderData = {
				seller_id: sellerId,
				customer_id: customerId,
				product_id: productId,
				product_price: productPrice,
				payment_method: paymentMethodInfo,
				delivery_name: deliveryName,
				delivery_email: deliveryEmail,
				additional_info: additionalInfo,
		  };
		  const url = 'http://localhost:8080/orders';
		  const response = await axios.post(url, orderData);
		  setOrderResultId(response.data.orderId);
		  const customMessage = { message: `${user.user_full_name} encomendou sua arte`, type: 'notification', receiverId: sellerId };
		  await createNotification(customMessage.message);
		  setIsLoading(false);
		} catch (error) {
		  setIsLoading(false);
		}
	};

	const setPaymentOption = (e) => {
		setPaymentMethod(e.target.value)
	};

	const goResumeOrder = () => {
		history.push(`/orders/resume/${orderResultId}`);
	};

	const createNotification = async (notificationMessage) => {
		const url = 'http://localhost:8080/notifications/create';
		return await axios.post(url, { notificationImage: user.user_avatar, notificationMessage, userId: orderProduct.product_created_by  });
	  };

	return (
		<div>
			<div id="header">
				<Header />
			</div>
			<div id="sidebarHome">
				<SideBar/>
				<div className="buy">
					<div className="order__right">
						<ProductDetail product={orderProduct}/>
						<span onClick={sendOrder} className="order-submit">Finalizar Compra</span>
						<SweetAlert
							show={loadingShow}
							title="Pedido Realizado"
							type='success'
							confirmButtonText="Ir para resumo"
							onConfirm={() => {
								setLoadingShow(false)
								goResumeOrder()
							}}
						/>
					</div>
					<div className="order__left">
						<div className="delivery-detail">
							<h2>1. Informações de entrega</h2>
							<div className="delivery-info">
								<label htmlFor="deliveryName">Nome</label>
								<input type="text" defaultValue={user?.user_full_name} id="deliveryName" ref={deliveryNameRef}></input>
								<label htmlFor="deliveryEmail">E-mail</label>
								<input type="email" defaultValue={user?.user_email} id="deliveryEmail" ref={deliveryEmailRef}></input>
							</div>
						</div>
						<div className="additional-detail">
							<h2>2. Informações adicionais</h2>
							<div className="additional-info">
								<label htmlFor="additionalInfo">Observações (opcional)</label>
								<textarea maxLength="255" placeholder="Adicione alguma informação adicional relacionada ao seu pedido" id="additionalInfo" ref={additionalInfoRef}></textarea>
							</div>
						</div>
						<div className="payment-detail">
							<h2>3. Pagamento</h2>
							<div className="payment-options" onChange={e => setPaymentOption(e)}>
								<div className="payment-option__cartao">
									<input type="radio" id="cartao" name="payment_option" value="cartao" defaultChecked={true}></input>
									<span className="payment-icon">
										<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M880-720v480q0 33-23.5 56.5T800-160H160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720Zm-720 80h640v-80H160v80Zm0 160v240h640v-240H160Zm0 240v-480 480Z"/></svg>
									</span>
									<label htmlFor="cartao">Cartão</label>
								</div>
								<div className="payment-option__pix">
									<input type="radio" id="pix" name="payment_option" value="pix"></input>
									<span className="payment-icon">
										<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style={{stroke: 'none', fillRule: 'nonzero', fill: 'rgb(0%,0%,0%)', fillOpacity: 1}} d="M 18.191406 17.855469 C 17.320312 17.855469 16.507812 17.523438 15.894531 16.90625 L 12.582031 13.597656 C 12.355469 13.367188 11.941406 13.367188 11.714844 13.597656 L 8.386719 16.921875 C 7.773438 17.535156 6.957031 17.871094 6.089844 17.871094 L 5.4375 17.871094 L 9.644531 22.078125 C 10.953125 23.386719 13.089844 23.386719 14.398438 22.078125 L 18.617188 17.859375 Z M 18.191406 17.855469 "/><path style={{stroke: 'none', fillRule: 'nonzero', fill: 'rgb(0%,0%,0%)', fillOpacity: 1}} d="M 6.078125 6.128906 C 6.945312 6.128906 7.757812 6.464844 8.375 7.078125 L 11.699219 10.402344 C 11.9375 10.644531 12.328125 10.644531 12.566406 10.402344 L 15.894531 7.09375 C 16.507812 6.476562 17.320312 6.144531 18.191406 6.144531 L 18.589844 6.144531 L 14.371094 1.921875 C 13.0625 0.613281 10.925781 0.613281 9.617188 1.921875 L 5.410156 6.128906 Z M 6.078125 6.128906 "/><path style={{stroke: 'none', fillRule: 'nonzero', fill: 'rgb(0%,0%,0%)', fillOpacity: 1}} d="M 22.078125 9.628906 L 19.523438 7.078125 C 19.472656 7.105469 19.40625 7.117188 19.339844 7.117188 L 18.175781 7.117188 C 17.574219 7.117188 16.988281 7.359375 16.574219 7.785156 L 13.261719 11.097656 C 12.953125 11.40625 12.539062 11.566406 12.140625 11.566406 C 11.726562 11.566406 11.324219 11.40625 11.019531 11.097656 L 7.691406 7.773438 C 7.265625 7.347656 6.679688 7.105469 6.089844 7.105469 L 4.660156 7.105469 C 4.59375 7.105469 4.542969 7.089844 4.488281 7.066406 L 1.921875 9.628906 C 0.613281 10.9375 0.613281 13.074219 1.921875 14.382812 L 4.476562 16.933594 C 4.527344 16.90625 4.582031 16.894531 4.648438 16.894531 L 6.078125 16.894531 C 6.679688 16.894531 7.265625 16.65625 7.679688 16.226562 L 11.003906 12.902344 C 11.605469 12.300781 12.660156 12.300781 13.261719 12.902344 L 16.574219 16.214844 C 17 16.640625 17.585938 16.882812 18.175781 16.882812 L 19.335938 16.882812 C 19.402344 16.882812 19.457031 16.894531 19.523438 16.921875 L 22.074219 14.371094 C 23.386719 13.0625 23.386719 10.9375 22.078125 9.628906 "/></g></svg>
									</span>
									<label htmlFor="pix">Pix</label>
								</div>
								<div className="payment-option__boleto">
									<input type="radio" id="boleto" name="payment_option" value="boleto"></input>
									<span className="payment-icon">
										<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 512 512"><path d="M24 32C10.7 32 0 42.7 0 56V456c0 13.3 10.7 24 24 24H40c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H24zm88 0c-8.8 0-16 7.2-16 16V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16zm72 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H184zm96 0c-13.3 0-24 10.7-24 24V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H280zM448 56V456c0 13.3 10.7 24 24 24h16c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24H472c-13.3 0-24 10.7-24 24zm-64-8V464c0 8.8 7.2 16 16 16s16-7.2 16-16V48c0-8.8-7.2-16-16-16s-16 7.2-16 16z"/></svg>
									</span>
									<label htmlFor="boleto">Boleto</label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Buy;