import React from 'react';
import PropTypes from 'prop-types';

const ACarousel = ({ items, title }) => {
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
            background: 'white',
            borderRadius: '8px',
            padding: '0'
          }}>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

ACarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.node.isRequired, // Expecting each item to have a 'content' property
  })).isRequired,
  title: PropTypes.string.isRequired,
};

export default ACarousel;
