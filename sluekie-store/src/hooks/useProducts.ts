import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { BRAND_CONFIG } from '../config/brand';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        let query = supabase
          .from('products')
          .select('*')
          .eq('brand_id', BRAND_CONFIG.brand_id)
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  return { products, isLoading, error };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('brand_id', BRAND_CONFIG.brand_id)
          .eq('active', true)
          .maybeSingle();

        if (fetchError) throw fetchError;

        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, isLoading, error };
}
