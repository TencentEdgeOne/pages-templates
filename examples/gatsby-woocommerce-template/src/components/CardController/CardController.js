import React, { useState } from 'react';

import Container from '../Container';
import Checkbox from '../Checkbox';
import * as styles from './CardController.module.css';
import Button from '../Button';
import Drawer from '../Drawer';
import Icon from '../Icons/Icon';

const CardController = (props) => {
  const { filters, visible, closeFilter } = props;
  const [category, setCategory] = useState();
  const [filterState, setFilterState] = useState(filters);

  const filterTick = (e, categoryIndex, labelIndex) => {
    const filterStateCopy = [...filterState];
    filterStateCopy[categoryIndex].items[labelIndex].value = e.target.checked;
    setFilterState(filterStateCopy);
  };

  const resetFilter = () => {
    const filterStateCopy = [...filterState];
    for (let x = 0; x < filterStateCopy.length; x++) {
      for (let y = 0; y < filterStateCopy[x].items.length; y++) {
        filterStateCopy[x].items[y].value = false;
      }
    }
    setFilterState(filterStateCopy);
  };

  return (
    <div>
      <div
        className={`${styles.webRoot} ${
          visible === true ? styles.show : styles.hide
        }`}
      >
        <Container>
          <div className={styles.filterContainer}>
            {filterState &&
              filterState.map((filter, categoryIndex) => {
                // if number of filter per category is less than 4 maintain single layout
                const colNum = filter.items.length >= 4 ? 2 : 1;
                return (
                  <div key={`category-${categoryIndex}`}>
                    <span className={styles.category}>{filter.category}</span>
                    <div
                      className={styles.nameContainers}
                      style={{ gridTemplateColumns: `repeat(${colNum}, 1fr)` }}
                    >
                      {filter.items &&
                        filter.items.map((item, itemIndex) => (
                          <Checkbox
                            key={itemIndex}
                            action={(e) =>
                              filterTick(e, categoryIndex, itemIndex)
                            }
                            label={item.name}
                            value={item.value}
                            id={item.name}
                            name={item.name}
                            isChecked={item.value}
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </Container>
        <div className={styles.actionContainer}>
          <Button
            onClick={closeFilter}
            className={styles.customButtonStyling}
            level={'primary'}
          >
            view items
          </Button>
          <Button
            onClick={closeFilter}
            className={styles.customButtonStyling}
            level={'secondary'}
          >
            close
          </Button>
        </div>
      </div>
      <div className={styles.mobileRoot}>
        <Drawer visible={visible} close={closeFilter}>
          <div className={styles.mobileFilterContainer}>
            <h2 className={styles.mobileFilterTitle}>Filters</h2>

            {category === undefined && (
              <div className={styles.mobileFilters}>
                {filterState?.map((filterItem, categoryIndex) => {
                  return (
                    <div
                      key={categoryIndex}
                      className={styles.filterItemContainer}
                      role={'presentation'}
                      onClick={() =>
                        setCategory({
                          ...filterItem,
                          categoryIndex: categoryIndex,
                        })
                      }
                    >
                      <span className={styles.filterName}>
                        {filterItem.category}
                      </span>
                      <Icon symbol={'arrow'}></Icon>
                    </div>
                  );
                })}
              </div>
            )}

            {category !== undefined && (
              <div className={styles.mobileCategoryContainer}>
                <div
                  className={styles.mobileHeader}
                  role={'presentation'}
                  onClick={() => setCategory(undefined)}
                >
                  <Icon symbol={'arrow'}></Icon>
                  <span className={styles.mobileCategory}>
                    {category.category}
                  </span>
                </div>
                {category.items.map((item, itemIndex) => {
                  return (
                    <Checkbox
                      key={itemIndex}
                      action={(e) =>
                        filterTick(e, category.categoryIndex, itemIndex)
                      }
                      label={item.name}
                      value={item.value}
                      id={item.name}
                      name={item.name}
                      isChecked={item.value}
                    />
                  );
                })}
              </div>
            )}

            <div className={styles.mobileButtonContainer}>
              {category === undefined && (
                <Button fullWidth level={'primary'}>
                  show results: 1234
                </Button>
              )}
              {category !== undefined && (
                <div>
                  <Button onClick={closeFilter} fullWidth level={'primary'}>
                    Apply
                  </Button>
                  <div
                    className={styles.clearFilterContainer}
                    role={'presentation'}
                    onClick={() => resetFilter()}
                  >
                    <span className={styles.clearFilter}>clear filters</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default CardController;
