import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function ProductsPage() {
  const { products, isLoading } = useProducts();

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading products...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '40px' }}>Products</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                height: '240px',
                background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {product.images[0]?.url ? (
                  <img src={product.images[0].url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                  <div>No Image</div>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{product.name}</h3>
                <p style={{ fontSize: '14px', opacity: 0.7, marginBottom: '15px' }}>
                  {product.description?.substring(0, 100)}...
                </p>
                <div style={{ fontSize: '24px', fontWeight: 600 }}>{formatCurrency(product.price)}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
