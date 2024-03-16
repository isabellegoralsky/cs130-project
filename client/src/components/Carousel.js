import React from 'react';
import PropTypes from 'prop-types';

/**
   * Construct a carousel.
   *
   * @name Carousel
   * @constructor
   * @param {items} items - items to display in the carousel
   * @param {String} title - title field <<unused>>
   */
const Carousel = ({ items, title }) => {
  return (
    <div style={{ padding: '0px 200px 20px' }}>
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '10px',
        padding: '10px 0'
      }}>
        {items.map((item, index) => (
          <div key={index} style={{
            minWidth: '160px',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            background: 'rgb(255, 90, 19, .1)',
            borderRadius: '8px',
            padding: '15px'
          }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.node.isRequired, // Expecting each item to have a 'content' property
  })).isRequired,
  title: PropTypes.string.isRequired,
};

export default Carousel;
