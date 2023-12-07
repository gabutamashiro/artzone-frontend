import { useCallback, useContext, useEffect, useState } from "react";
import Header from "../common/Header";
import SideBar from '../common/SideBar';
import Context from '../../context';
import axios from "axios";

const OrderResume = (props) => {
  const orderId = props.match.params.id

  const {setIsLoading} = useContext(Context);

  const [order, setOrder] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState(null);

  const [orderProduct, setOrderProduct] = useState(null);

  let loadOrder = null;
  let formatPaymentMethod = null;
  let loadOrderProduct = null;

  useEffect(() => {
    if (orderId){
      loadOrder()
    }
    }, [loadOrder, orderId])

  loadOrder = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `http://localhost:8080/orders/${orderId}`;
      const response = await axios.get(url);
      setOrder(() => response.data[0]);
      formatPaymentMethod(response.data[0].payment_method)
      loadOrderProduct(response.data[0].product_id)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
    }, [setIsLoading, orderId, formatPaymentMethod, loadOrderProduct])

  formatPaymentMethod = useCallback((payment_method) => {
    switch(payment_method) {
      case 'cartao':
        setPaymentMethod('Cartão de crédito')
        break
      case 'pix':
        setPaymentMethod('Pix')
        break
      case 'boleto':
        setPaymentMethod('Boleto')
        break
      default:
        setPaymentMethod(payment_method)
        break
    }
  }, [setPaymentMethod])

  loadOrderProduct = useCallback(async (orderProductId) => {
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
	}, [setIsLoading]);

  return (
    <div>
      <div id="header">
        <Header/>
      </div>
      <div id="sidebarHome">
        <SideBar/>
        <div className="order-resume">
          <h2>Pedido concluído!</h2>
          <div className="order-resume__infos">
            <h3>Informações Do Pedido</h3>
            <div className="order-resume__data">
              <span>ID: {order?.id}</span>
              <span>Total: R$ {order?.product_price}</span>
              <span>Forma de pagamento: {paymentMethod}</span>
              <span>Nome do destinatário: {order?.delivery_name}</span>
              <span>E-mail do destinatário: {order?.delivery_email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderResume;