/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );
    // eslint-disable-next-line no-shadow
    const user = usersFromServer.find(user => user.id === category?.ownerId);

    return {
      ...product,
      category: category
        ? `${category.icon} - ${category.title}`
        : 'Unknown Category',
      owner: user ? user.name : 'Unknown User',
      ownerGender: user ? user.sex : null,
    };
  });

  const filteredProducts = products.filter(product => {
    const category = categoriesFromServer.find(
      cat => cat.id === product.categoryId,
    );

    const matchesUser =
      selectedUserId === null ||
      (category && category.ownerId === selectedUserId);
    const matchesSearch = product.name.toLowerCase().includes
    (searchValue.toLowerCase());

    return matchesUser && matchesSearch;
  });

  const handleUserClick = userId => {
    if (userId === null) {
      setSelectedUserId(null);
    } else {
      setSelectedUserId(userId);
    }
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  const handleResetFilters = () => {
    setSelectedUserId(null);
    setSearchValue('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': selectedUserId === null })}
                onClick={() => handleUserClick(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy={`FilterUser-${user.id}`}
                  href="#/"
                  className={cn({ 'is-active': selectedUserId === user.id })}
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {searchValue && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={handleClearSearch}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a data-cy="Category" className="button mr-2 my-1" href="#/">
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <button
                type="button"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
                aria-label="Reset all filters"
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>

                    <td data-cy="ProductCategory">{product.category}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.ownerGender === 'm',
                        'has-text-danger': product.ownerGender === 'f',
                      })}
                    >
                      {product.owner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
