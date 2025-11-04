import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number, variantId?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  syncWithSupabase: (userId?: string) => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: (product, quantity = 1, variantId) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product_id === product.id &&
              item.variant_id === variantId
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          }

          const price = variantId
            ? product.variants.find((v) => v.id === variantId)?.price || product.price
            : product.price;

          return {
            items: [
              ...state.items,
              {
                product_id: product.id,
                product,
                variant_id: variantId,
                quantity,
                price,
              },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product_id === productId && item.variant_id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId && item.variant_id === variantId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithSupabase: async (userId) => {
        if (!userId) return;

        set({ isLoading: true });

        try {
          const { items } = get();

          const { data: existingCart } = await supabase
            .from('carts')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (existingCart) {
            await supabase
              .from('carts')
              .update({ items, updated_at: new Date().toISOString() })
              .eq('id', existingCart.id);
          } else {
            await supabase.from('carts').insert({
              user_id: userId,
              items,
            });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
