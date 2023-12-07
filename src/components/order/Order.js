import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import Context from '../../context';

const Order = (props) => {
	const {order} = props;

	const {setIsLoading} = useContext(Context);

	const [orderProduct, setOrderProduct] = useState(null)

	let loadOrderProduct = null;

	useEffect(() => {
		loadOrderProduct();
	}, [loadOrderProduct]);

	loadOrderProduct = useCallback(async () => {
		const orderProductId = order.product_id;
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
	}, [setIsLoading, order]);

	return (
		<div className="order">
			<span className="order__id"># {order.id}</span>
			<span className="order__content">
			{ orderProduct?.product_category === 1 &&
				<img src={`http://localhost:8080${orderProduct.product_content}`} alt={`${orderProduct.product_created_by} - ${orderProduct.product_created_date}`}/>
			}
			{ orderProduct?.product_category === 2 &&
				<video>
					<source src={`http://localhost:8080${orderProduct.product_content}`} type="video/mp4"></source>
				</video>
			}
			</span>
			<span className="order__description">
				{orderProduct?.product_description}
			</span>
			<span className="order__price">
				R$ {order.product_price}
			</span>
			<span className="order__payment-method">
				{order.payment_method}
			</span>
		</div>
	)
}

export default Order;