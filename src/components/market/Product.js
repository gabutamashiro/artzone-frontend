const Product = (props) => {
    const { product, onItemClicked } = props;
  
    const selectProduct = () => {
      onItemClicked(product);
    };
  
    return (
      <div className="product" onClick={selectProduct}>
        { product.product_category === 1 &&
          <img src={`http://localhost:8080${product.product_content}`} alt={`${product.product_created_by} - ${product.product_created_date}`}/>
        }
        { product.product_category === 2 &&
          <video width="320" height="240">
            <source src={`http://localhost:8080${product.product_content}`} type="video/mp4"></source>
          </video>
        }
      </div>
    );
  };
export default Product;