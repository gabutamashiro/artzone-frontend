import { useContext } from 'react';
import Detail from './Detail';
import withModal from '../common/Modal';
import Context from '../../context';
import Product from './Product';

const Products = (props) => {
  const { toggleModal, products, customStyle } = props;

  const { setSelectedProduct } = useContext(Context);

  const onItemClicked = (product) => {
    if (!product) {
      return;
    }
    setSelectedProduct(product);
    toggleModal(true);
  };

  if (!products || !products.length) {
    return <></>
  }

  return (
    <div className="products" style={{ ...customStyle }}>
      {products.map(product => <Product key={product.id} product={product} onItemClicked={onItemClicked} />)}
    </div>
  );
};

export default withModal(Detail)(Products);