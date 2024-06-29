import React, { useState, useEffect } from 'react';
import { Button } from './../../components/ui/button';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const styles = {
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '300px', // Set a fixed height to limit dialog growth
  },
  selectContainer: {
    display: 'flex',
    gap: '15px',
  },
  selectWrapper: {
    flex: '1',
    marginTop : '12px',
    marginLeft : '5px' // Take remaining space in the flex container
  },
  selectedCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    maxHeight: '200px', // Set a max height to limit dialog growth
    overflowY: 'auto', // Enable vertical scrolling if content exceeds max height
    flex: '1', // Take remaining space in the flex container
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '1px 5px',
    backgroundColor: '#8BC34A', // Soothing green color
    color: '#FFF',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#7CB342', // Slightly darker green for hover
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
  crossButton: {
    marginLeft: '5px',
    color: '#FF0000',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  crossButtonHover: {
    color: '#D00000',
  },
};

export default function Filter({ availableCategories, kFilter }) {
  // Initialize allCategories with availableCategories prop
  const [allCategories, setAllCategories] = useState([...availableCategories]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filterType, setFilterType] = useState('inclusive');
  const [filterOptions, setFilterOptions] = useState('Get Top K Data Items');

  useEffect(() => {
    setAllCategories([...availableCategories]);
  }, [availableCategories]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategories([...selectedCategories, category]);
    setAllCategories(allCategories.filter((item) => item[0] !== category[0]));
  };

  const handleCategoryRemove = (category) => {
    setSelectedCategories(selectedCategories.filter((item) => item[0] !== category[0]));
    setAllCategories([...allCategories, category]);
  };

  const handleSaveCategories = () => {
    console.log('Selected Categories:', selectedCategories);
    console.log('Filter Type:', filterType);
    handleCloseDialog();
  };

  const handleFilterTypeChange1 = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterTypeChange2 = (event) => {
    setFilterOptions(event.target.value);
  };

  // Render only if availableCategories exist
  if (!availableCategories || availableCategories.length === 0) {
    return null;
  }

  return (
    <>
      <Button variant="ghost" onClick={handleOpenDialog}>
        Filter
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Select Filters</DialogTitle>
        <DialogContent style={styles.dialogContent}>
          <>
          <h2>Category Filters</h2>
          <div style={styles.selectContainer}>
            <div style={{ marginTop: '10px', display : 'flex', flexDirection: 'column' }}>
              <label>
                <input
                  type="radio"
                  value="inclusive"
                  checked={filterType === 'inclusive'}
                  onChange={handleFilterTypeChange1}
                />
                <span style={{ marginLeft: '5px' }}>Inclusive</span>
              </label>
              <label>
                <input
                  type="radio"
                  value="exclusive"
                  checked={filterType === 'exclusive'}
                  onChange={handleFilterTypeChange1}
                />
                <span style={{ marginLeft: '5px' }}>Exclusive</span>
              </label>
            </div>
            <div style={styles.selectWrapper}>
              <select
                onChange={(e) => handleCategorySelect(JSON.parse(e.target.value))}
                value=""
                className="border rounded w-full py-2 px-3"
              >
                <option value="" disabled>Select Category</option>
                {allCategories.map((category) => (
                  <option key={category[0]} value={JSON.stringify(category)}>
                    {category[1]}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.selectedCategories}>
              {selectedCategories.map((category) => (
                <div key={category[0]} style={styles.button}>
                  {category[1]}
                  <span
                    onClick={() => handleCategoryRemove(category)}
                    style={styles.crossButton}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>
          { kFilter && (
            <>
            <h2>Filter Options</h2>
            <div style={styles.selectContainer}>
              <div style={{ marginTop: '3px', display : 'flex', flexDirection: 'column' }}>
                <label>
                  <input
                    type="radio"
                    value="Get Top K Data Items"
                    checked={filterOptions === 'Get Top K Data Items'}
                    onChange={handleFilterTypeChange2}
                  />
                  <span style={{ marginLeft: '5px' }}>Get Top K Data Items</span>
                </label>
                <label>
                  <input
                    type="radio"
                    value="Get Data Items Based on Date Range"
                    checked={filterOptions === 'Get Data Items Based on Date Range'}
                    onChange={handleFilterTypeChange2}
                  />
                  <span style={{ marginLeft: '5px' }}>Get Data Items Based on Date Range</span>
                </label>
                <span >Enter K Value :</span>
                <input type="number" placeholder="10" className="border rounded w-full py-2 px-3" />
              </div>
            </div>
            </>
          )}
          
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategories} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
