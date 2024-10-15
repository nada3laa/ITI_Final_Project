import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../Sidebar';
import { Container, Box } from '@mui/material';

const PRODUCTS_API = "http://localhost:3000/products";
const CATEGORIES_API = "http://localhost:3000/categories";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', brand: '', description: '', image: [] });
    const [editProduct, setEditProduct] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: '', image: '' });
    const [showProductForm, setShowProductForm] = useState(false);
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(PRODUCTS_API).then(res => res.json()).then(data => setProducts(data));
        fetch(CATEGORIES_API).then(res => res.json()).then(data => setCategories(data));
    }, []);

    // Add a new product
    const addProduct = (e) => {
        e.preventDefault();
        fetch(PRODUCTS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        }).then(res => res.json()).then((createdProduct) => {
            setProducts([...products, createdProduct]);
            setNewProduct({ name: '', price: '', category: '', brand: '', description: '', image: [] });
            setShowProductForm(false);
            alert("Product added successfully!");
        });
    };

    // Update a product
    const updateProduct = (e) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to update this product?")) {
            fetch(`${PRODUCTS_API}/${editProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editProduct)
            }).then(res => res.json()).then((updatedProduct) => {
                setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
                setEditProduct(null);
                alert("Product updated successfully!");
            });
        }
    };

    // Delete a product
    const deleteProduct = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch(`${PRODUCTS_API}/${productId}`, {
                method: 'DELETE',
            }).then(() => {
                setProducts(products.filter(p => p.id !== productId));
                alert("Product deleted successfully!");
            });
        }
    };

    // Add a new category
    const addCategory = (e) => {
        e.preventDefault();
        fetch(CATEGORIES_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCategory)
        }).then(res => res.json()).then(() => {
            setCategories([...categories, newCategory]);
            setNewCategory({ name: '', image: '' });
            setShowCategoryForm(false);
            alert("Category added successfully!");
        });
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f7f7f7' }}>
            <div style={{ width: '300px', height: '100vh', flexShrink: 0, backgroundColor: '#ffe0e0' }}>
                <Sidebar />
            </div>
            <Container sx={{ flexGrow: 1, padding: { xs: '10px', md: '20px' } }}>
                <h2 className="text-center mb-4">Product Management</h2>
                <button className="btn btn-primary mb-3" style={{ backgroundColor: '#DD356E' }} onClick={() => setShowProductForm(true)}>Add New Product</button>
                <button className="btn btn-primary mb-3 ms-3" style={{ backgroundColor: '#DD356E' }} onClick={() => setShowCategoryForm(true)}>Add New Category</button>

                <h4>Products</h4>
                <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Brand</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#FFE8E8' }}>
                                    <td>
                                        {Array.isArray(product.image) && product.image.length > 0 ? (
                                            <img src={product.image[0]} alt={product.name} style={{ width: '60px', height: 'auto' }} />
                                        ) : (
                                            <img src={product.image} alt={product.name} style={{ width: '60px', height: 'auto' }} />
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" style={{ color: 'white', marginBottom: '15px', backgroundColor: "#DD356E" }} onClick={() => setEditProduct(product)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button className="btn btn-danger btn-sm" style={{ color: 'white', backgroundColor: "#DD356E" }} onClick={() => deleteProduct(product.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit Product Modal */}
                {editProduct && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditProduct(null)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={updateProduct}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input type="number" className="form-control" id="price" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select className="form-select" id="category" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category.name}>{category.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="brand" className="form-label">Brand</label>
                                            <input type="text" className="form-control" id="brand" value={editProduct.brand} onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea className="form-control" id="description" rows="3" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Image</label>
                                            <input type="text" className="form-control" id="image" value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: [e.target.value] })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Update Product</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Product Form */}
                {showProductForm && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Product</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowProductForm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={addProduct}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Name</label>
                                            <input type="text" className="form-control" id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input type="number" className="form-control" id="price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="category" className="form-label">Category</label>
                                            <select className="form-select" id="category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                                {categories.map((category, index) => (
                                                    <option key={index} value={category.name}>{category.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="brand" className="form-label">Brand</label>
                                            <input type="text" className="form-control" id="brand" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea className="form-control" id="description" rows="3" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Image</label>
                                            <input type="text" className="form-control" id="image" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: [e.target.value] })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Add Product</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Category Form */}
                {showCategoryForm && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Category</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowCategoryForm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={addCategory}>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Category Name</label>
                                            <input type="text" className="form-control" id="name" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Category Image</label>
                                            <input type="text" className="form-control" id="image" value={newCategory.image} onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Add Category</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </Box>
    );
}

export default AdminProducts;
