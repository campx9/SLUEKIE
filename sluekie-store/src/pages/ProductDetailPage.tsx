import { useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
        <div style={{
          height: '600px',
          background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
          borderRadius: '20px',
        }}></div>
        <div>
          <h1 style={{ fontSize: '42px', marginBottom: '20px' }}>{product.name}</h1>
          <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '20px' }}>
            {formatCurrency(product.price)}
          </div>
          <p style={{ marginBottom: '30px', lineHeight: 1.6 }}>{product.description}</p>
          <button
            onClick={() => addItem(product)}
            style={{
              padding: '16px 32px',
              background: '#1E2D4D',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
