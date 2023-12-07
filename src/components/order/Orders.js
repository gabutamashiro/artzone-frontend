import { useCallback, useContext, useEffect, useState } from 'react';
import Header from '../common/Header';
import SideBar from '../common/SideBar';
import Actions from './Actions';
import axios from 'axios';
import Context from '../../context';
import Order from './Order';

const Orders = (props) => {
	const {user, setIsLoading} = useContext(Context);

  const params = props.match.params;

	const [orders, setOrders] = useState([]);
	const [selectedActionOrder, setSelectedActionOrder] = useState(1);

	let loadOrders = null;
	let loadOrdersByAction = null;

  useEffect(() => {
    loadOrdersByAction(selectedActionOrder)
	}, [selectedActionOrder, loadOrdersByAction])

  loadOrdersByAction = useCallback((action) => {
    let typeOrder;
    if(action === 1) {
      typeOrder = 'buy';
    } else if (action === 2) {
      typeOrder = 'sell';
    }
    loadOrders(typeOrder)
  }, [loadOrders])

	loadOrders = useCallback(async (type) => {
    try {
      const userId = params.id;
			const userType = type;
      setIsLoading(true);
      const url = 'http://localhost:8080/orders';
      const response = await axios.get(url, {
        params: {
          user_id: userId, 
          user_type: userType
        }
      });
      setOrders(() => response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
	}, [setIsLoading, user])

	const onItemClickedOrder = (selectedActionOrder) => {
		loadOrdersByAction(selectedActionOrder);
    setSelectedActionOrder(selectedActionOrder);
	};

	return (
		<div>
			<div id="header">
				<Header />
			</div>
			<div id="sidebarHome">
				<SideBar/>
				<div className='orders'>
					<Actions onItemClickedOrder={onItemClickedOrder} />
          <div className='orders-list'>
            {orders.map(order => <Order key={order.id} order={order} />)}
          </div>
				</div>
			</div>
		</div>
	);
}

export default Orders;