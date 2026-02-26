import { useState, useCallback } from 'react';
import * as productService from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      console.log('📥 Fetched products:', response.data);
      setProducts(Array.isArray(response.data) ? response.data : []);
      return response;
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    // KHÔNG SET LOADING = TRUE để tránh clear UI
    // setLoading(true); // <- BỎ DÒNG NÀY
    setError(null);
    
    // Thêm id vào updatingIds để show loading cho từng product
    setUpdatingIds(prev => new Set([...prev, parseInt(id)]));
    
    try {
      console.log('📤 Updating product:', id, productData);
      
      const response = await productService.updateProduct(id, productData);
      
      console.log('📥 Update response:', response);
      
      if (response && response.success) {
        console.log('✅ Update successful, refetching products...');
        
        // Fetch lại nhưng KHÔNG set loading để UI không bị clear
        try {
          const fetchResponse = await productService.getProducts();
          if (fetchResponse && fetchResponse.data) {
            setProducts(Array.isArray(fetchResponse.data) ? fetchResponse.data : []);
            console.log('✅ Products refetched successfully');
          }
        } catch (fetchError) {
          console.error('❌ Error refetching products:', fetchError);
        }
        
        return response;
      } else {
        throw new Error('Update failed');
      }
      
    } catch (err) {
      console.error('❌ Update error:', err);
      setError(err.message);
      return null;
    } finally {
      // Remove id khỏi updatingIds
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(parseInt(id));
        return newSet;
      });
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📤 Creating product:', productData);
      
      const response = await productService.createProduct(productData);
      
      console.log('📥 Create response:', response);
      
      if (response && response.success && response.data) {
        // Thêm product mới vào đầu danh sách NGAY LẬP TỨC
        const newProduct = {
          ...response.data,
          id: response.data.id,
          name: response.data.name || 'Unnamed Product',
          price: response.data.price || 0,
          sale_price: response.data.sale_price || null,
          image: response.data.image || null,
          category_name: response.data.category_name || 'Chưa phân loại',
          is_featured: Boolean(response.data.is_featured),
          is_available: response.data.is_available !== false
        };

        console.log('🔧 Processed new product:', newProduct);
        
        setProducts(prev => [newProduct, ...prev]);
        console.log('✅ Product added to state');
        return response;
      }
      
      throw new Error('Invalid create response');
      
    } catch (err) {
      console.error('❌ Create error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    // KHÔNG set loading để tránh clear UI
    setError(null);
    
    // Thêm vào updatingIds
    setUpdatingIds(prev => new Set([...prev, parseInt(id)]));
    
    try {
      await productService.deleteProduct(id);
      
      // Remove ngay khỏi state
      setProducts(prev => prev.filter(product => product.id !== parseInt(id)));
      console.log('✅ Product removed from state');
      return true;
      
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError(err.message);
      return false;
    } finally {
      // Remove id khỏi updatingIds
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(parseInt(id));
        return newSet;
      });
    }
  }, []);

  const toggleFeatured = useCallback(async (id) => {
    setError(null);
    
    // Thêm vào updatingIds
    setUpdatingIds(prev => new Set([...prev, parseInt(id)]));
    
    try {
      console.log('🔄 Toggling featured for product:', id);
      
      const response = await productService.toggleProductFeatured(id);
      
      console.log('📥 Toggle response:', response);
      
      if (response && response.success && response.data) {
        setProducts(prev => 
          prev.map(product => 
            product.id === parseInt(id)
              ? { ...product, is_featured: response.data.is_featured }
              : product
          )
        );
        console.log('✅ Featured status updated in state');
        return response;
      }
      
      throw new Error('Invalid response from server');
    } catch (err) {
      console.error('❌ Toggle featured error:', err);
      setError(err.message);
      return null;
    } finally {
      // Remove id khỏi updatingIds
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(parseInt(id));
        return newSet;
      });
    }
  }, []);

  return {
    products,
    loading,
    error,
    updatingIds,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured
  };
};