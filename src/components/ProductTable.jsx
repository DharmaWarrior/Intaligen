import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table";

const ProductTable = ({ products }) => {
  const [expandedProducts, setExpandedProducts] = useState({});

  const toggleProductDetails = (index) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderProductRows = (product, index) => {
    const isExpanded = expandedProducts[index];
    return (
      <React.Fragment key={`product-${index}`}>
        <TableRow key={`product-row-${index}`}>
          <TableCell
            className="py-2 px-4 border-b cursor-pointer text-violet-800 hover:underline"
            onClick={() => toggleProductDetails(index)}
          >
            {product.name}
          </TableCell>
          <TableCell className="py-2 px-4 border-b">{product.allocated}</TableCell>
          <TableCell className="py-2 px-4 border-b">{product.unit}</TableCell>
          <TableCell className="py-2 px-4 border-b">0</TableCell>
        </TableRow>
        {isExpanded && product.children && product.children.length > 0 && (
          <TableRow key={`product-details-${index}`}>
            <TableCell colSpan={4} className="py-2 px-4 border-b">
              <ProductTable products={product.children} />
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <Table className="min-w-full bg-white">
      <TableHeader>
        <TableRow>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Alloted</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Finished</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => renderProductRows(product, index))}
      </TableBody>
    </Table>
  );
};

ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      allocated: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      children: PropTypes.array,
    })
  ).isRequired,
};

export default ProductTable;
